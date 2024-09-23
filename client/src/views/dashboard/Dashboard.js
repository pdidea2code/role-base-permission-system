import MUIDataTable from 'mui-datatables'
import { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { deleteUser, getDashboard, getrole, getRole, getUser } from 'src/redux/api/api'
import * as Icons from '@mui/icons-material'
import swal from 'sweetalert'
import Cookies from 'js-cookie'
import { CSpinner } from '@coreui/react'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import authReducer from 'src/redux/reducer/authReducer'
import { cleanPermissions } from 'src/routes'
const userdetail = JSON.parse(Cookies.get('admin'))

const Dashboard = () => {
  const [dataTableData, setDataTabledata] = useState([])
  const [baseUrl, setBaseUrl] = useState('')
  const [insert, setInsert] = useState(false)
  const [update, setUpdate] = useState(false)
  const [deletes, setDeletes] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const auth = useSelector((state) => state.auth)
  const [permission, setPermissions] = useState()

  const getuser = async () => {
    try {
      setIsLoading(true)
      const data = { role: userdetail.role }
      const res = await getDashboard(data)
      setDataTabledata(res.data.info)
      setBaseUrl(res.data.baseUrl)
      setIsLoading(false)
    } catch (error) {
      console.log(error)
      setIsLoading(false)
      toast.error(error.response?.data?.message || 'An error occurred')
    }
  }
  useEffect(() => {
    getrole(dispatch)
    // const permissionsString = Cookies.get('permission') || '[]' // Default to empty array if cookie is not set
    // const permissions = cleanPermissions(permissionsString)

    if (auth.permission === null) {
      const permissionsString = Cookies.get('permission') || '[]' // Default to empty array if cookie is not set
      const permissions = cleanPermissions(permissionsString)
      setPermissions(permissions)
    } else {
      setPermissions(auth.permission)
    }
  }, [])

  useEffect(() => {
    getuser()

    if (!Cookies.get('role') || !Cookies.get('permission')) {
      getrole()
    }
  }, [])

  const columns = [
    {
      name: 'name',
      label: 'name',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'email',
      label: 'email',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'image',
      label: 'image',
      options: {
        customBodyRender: (image) =>
          image && (
            <img
              src={`${baseUrl}${image}`}
              alt={image}
              style={{ height: '60px', width: '60px', borderRadius: '50%' }}
            />
          ),
      },
    },
  ]

  if (update || deletes) {
    columns.push({
      name: '_id',
      label: 'action',
      options: {
        customBodyRender: (value) => {
          return (
            <>
              {update && (
                <Icons.EditRounded
                  className="editButton"
                  onClick={() => {
                    const editData = dataTableData.find((data) => data._id === value)
                    navigate('/userform', {
                      state: { role: 'user', editData: editData, imageUrl: baseUrl },
                    })
                  }}
                ></Icons.EditRounded>
              )}

              {deletes && (
                <Icons.DeleteRounded
                  className="deleteButton"
                  onClick={async () => {
                    const consfirm = await swal({
                      title: 'Are you sure?',
                      text: 'Are you sure? Want to delete Category? All related data will also be deleted',
                      icon: 'warning',
                      buttons: ['No, cancel it!', 'Yes, I am sure!'],
                      dangerMode: true,
                    })
                    if (consfirm) {
                      const data = { id: value }
                      deleteUser(data)
                        .then(() => {
                          getuser()
                          toast.success('Deleted successfully!', {
                            key: value,
                          })
                          swal({
                            title: 'Deleted successfully!',

                            icon: 'success',
                            button: 'close',
                          })
                        })
                        .catch((error) => {
                          console.log(error)
                          const errorMsg = error.response?.data?.message || 'Something went wrong'
                          toast.error(errorMsg, {
                            key: value,
                          })
                        })
                    }
                  }}
                ></Icons.DeleteRounded>
              )}
            </>
          )
        },
      },
    })
  }

  const options = { selectableRows: 'none', onRowsDelete: false }
  return (
    <>
      {isLoading ? (
        <div className="d-flex justify-content-center">
          <CSpinner className="theme-spinner-color" />
        </div>
      ) : (
        <>
          <ToastContainer />
          {insert && (
            <div className="right-text">
              <Button
                variant="contained"
                size="medium"
                className="AddButton"
                onClick={() => navigate('/userform', { state: { role: 'user' } })}
              >
                Add
              </Button>
            </div>
          )}
          <MUIDataTable
            title={userdetail.role}
            data={dataTableData}
            columns={columns}
            options={options}
          />
        </>
      )}
    </>
  )
}

export default Dashboard
