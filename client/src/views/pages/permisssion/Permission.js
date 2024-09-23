import { useEffect, useState } from 'react'
import { deletePermission, getPermission, getrole } from 'src/redux/api/api'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { CSpinner } from '@coreui/react'
import MUIDataTable from 'mui-datatables'
import * as Icons from '@mui/icons-material'
import swal from 'sweetalert'
import { Button } from '@mui/material'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { cleanPermissions } from 'src/routes'

const Permission = () => {
  const [dataTableData, setDataTabledata] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const auth = useSelector((state) => state.auth)
  const [permission, setPermissions] = useState([])

  const permissions = async () => {
    try {
      setIsLoading(true)
      const res = await getPermission()
      const data = res.data.info

      setDataTabledata(data)
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
    permissions()
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
  ]

  if (permission.includes('permission.delete')) {
    columns.push({
      name: '_id',
      label: 'action',
      options: {
        customBodyRender: (value) => {
          return (
            <>
              <Icons.DeleteRounded
                className="deleteButton"
                onClick={async () => {
                  const consfirm = await swal({
                    title: 'Are you sure?',
                    text: 'Are you sure? Want to delete permission?',
                    icon: 'warning',
                    buttons: ['No, cancel it!', 'Yes, I am sure!'],
                    dangerMode: true,
                  })
                  if (consfirm) {
                    deletePermission(value)
                      .then(() => {
                        permissions()
                        toast.success('Deleted successfully!')
                        swal({
                          title: 'Deleted successfully!',
                          icon: 'success',
                          button: 'close',
                        })
                      })
                      .catch((error) => {
                        console.log(error)
                        const errorMsg = error.response?.data?.message || 'Something went wrong'
                        toast.error(errorMsg)
                      })
                  }
                }}
              ></Icons.DeleteRounded>
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
          {permission.includes('permission.add') && (
            <div className="right-text">
              <Button
                variant="contained"
                size="medium"
                className="AddButton"
                onClick={() => navigate('/permissionform')}
              >
                Add
              </Button>
            </div>
          )}
          <MUIDataTable
            title={'Permission'}
            data={dataTableData}
            columns={columns}
            options={options}
          />
        </>
      )}
    </>
  )
}

export default Permission
