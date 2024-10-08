import { Icon } from '@mui/material'
import MUIDataTable from 'mui-datatables'
import { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { deleteUser, getallRole, getrole, getRole, getUser } from 'src/redux/api/api'
import * as Icons from '@mui/icons-material'
import swal from 'sweetalert'
import Cookies from 'js-cookie'
import { CListGroup, CSpinner } from '@coreui/react'
import { Button, IconButton } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { cleanPermissions } from 'src/routes'

const Admin = () => {
  const { state } = useLocation()
  const [dataTableData, setDataTabledata] = useState([])
  const [baseUrl, setBaseUrl] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [roles, setRoles] = useState([])
  const [role, setRole] = useState('user')
  const navigate = useNavigate()
  const [permission, setPermissions] = useState([])
  const auth = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const getallrolle = async () => {
    try {
      const res = await getallRole()
      setRoles(res.data.info)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch roles')
    }
  }

  useEffect(() => {
    if (state) {
      setRole(state.role)
    }
    getallrolle()
    getrole(dispatch)

    if (auth.permission === null) {
      const permissionsString = Cookies.get('permission') || '[]' // Default to empty array if cookie is not set
      const permissions = cleanPermissions(permissionsString)
      setPermissions(permissions)
    } else {
      setPermissions(auth.permission)
    }
  }, [])

  const getuser = async () => {
    try {
      setIsLoading(true)
      const data = {
        role: role,
      }
      const res = await getUser(data)
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
    getuser()
    const getrole = async () => {
      try {
        setIsLoading(true)
        const role = await getRole()
        const data = role.data.info

        setIsLoading(false)
      } catch (error) {
        console.log(error)
        setIsLoading(false)
        toast.error(error.response?.data?.message || 'Error occurred ')
      }
    }
    getrole()
  }, [role])

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
        filter: false,
        sort: false,

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

  if (permission.includes('user.delete') || permission.includes('user.edit')) {
    columns.push({
      name: '_id',
      label: 'action',
      options: {
        filter: false,
        sort: false,
        search: false,
        customBodyRender: (value) => {
          return (
            <>
              {permission.includes('user.edit') && (
                <Icons.EditRounded
                  className="editButton"
                  onClick={() => {
                    const editData = dataTableData.find((data) => data._id === value)
                    navigate('/userform', {
                      state: { role: role, editData: editData, imageUrl: baseUrl },
                    })
                  }}
                ></Icons.EditRounded>
              )}

              {permission.includes('user.delete') && (
                <Icons.DeleteRounded
                  className="deleteButton"
                  onClick={async () => {
                    const consfirm = await swal({
                      title: 'Are you sure?',
                      text: 'Are you sure? Want to delete Admin?',
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
          {permission.includes('user.add') && (
            <div className="right-text">
              <Button
                variant="contained"
                size="medium"
                className="AddButton"
                onClick={() => navigate('/userform', { state: { role: role } })}
              >
                Add
              </Button>
            </div>
          )}
          <div className="my-4">
            {/* <Button
              onClick={() => setRole('user')}
              variant="contained"
              size="medium"
              className="AddButton me-2"
            >
              User
            </Button>
            <Button
              onClick={() => setRole('admin')}
              variant="contained"
              size="medium"
              className="AddButton me-2"
            >
              Admin
            </Button> */}
            {auth.role === 'superadmin' &&
              roles
                /* .filter((data) => data.name !== 'superadmin') */
                .map((data) => (
                  <Button
                    onClick={() => setRole(data.name)}
                    variant="contained"
                    size="medium"
                    className="AddButton me-2"
                  >
                    {data.name}
                  </Button>
                ))}
          </div>
          <MUIDataTable title={role} data={dataTableData} columns={columns} options={options} />
        </>
      )}
    </>
  )
}

export default Admin
