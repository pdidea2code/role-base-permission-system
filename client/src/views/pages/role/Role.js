import { useState, useEffect } from 'react'

import swal from 'sweetalert'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CFormCheck,
  CRow,
  CSpinner,
} from '@coreui/react'
import { changepermission, deleteRole, getallRole, getrole } from 'src/redux/api/api'
import { toast, ToastContainer } from 'react-toastify'
import { Button, IconButton } from '@mui/material'
import 'react-toastify/dist/ReactToastify.css'
import Switch from '@mui/material/Switch'
import { useNavigate } from 'react-router-dom'
import * as Icons from '@mui/icons-material'
import Cookies from 'js-cookie'
import { cleanPermissions } from 'src/routes'
import { useDispatch, useSelector } from 'react-redux'
import { PERMISSION } from 'src/redux/actions/action'

const Role = () => {
  const [roles, setRoles] = useState([])
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [permission, setPermissions] = useState([])
  const auth = useSelector((state) => state.auth)

  const dispatch = useDispatch()

  const getroll = async () => {
    try {
      setIsLoading(true)

      const res = await getallRole()
      setRoles(res.data.info)

      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      toast.error(error.response?.data?.message || 'Failed to fetch roles')
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
    getroll()
  }, [])

  return (
    <>
      {/* {isLoading ? (
        <div className="d-flex justify-content-center">
          <CSpinner className="theme-spinner-color" />
        </div>
      ) : ( */}

      <CContainer>
        <ToastContainer draggable />
        {/* {roles.length <= 0 && <h1>Role Not Found</h1>} */}
        {roles.length > 0 && (
          <CRow>
            <CCol md={12} xl={10}>
              {permission.includes('role.add') && (
                <div className="right-text">
                  <Button
                    variant="contained"
                    size="medium"
                    className="AddButton"
                    onClick={() => navigate('/roleform', { state: { role: 'user' } })}
                  >
                    Add
                  </Button>
                </div>
              )}

              {roles
                /* .filter((data) => data.name !== 'superadmin') */
                .map((data) => (
                  <CCard key={data._id} className="mb-2">
                    <CCardHeader>
                      <CRow>
                        <CCol md={10} xl={10}>
                          {data.name}
                        </CCol>
                        <CCol md={2} xl={2}>
                          {permission.includes('role.delete') && (
                            <Icons.DeleteRounded
                              onClick={async () => {
                                const confirm = await swal({
                                  title: 'Are you sure?',
                                  text: 'Are you sure? Want to delete Category? All related data will also be deleted',
                                  icon: 'warning',
                                  buttons: ['No, cancel it!', 'Yes, I am sure!'],
                                  dangerMode: true,
                                })
                                if (confirm) {
                                  const datas = {
                                    id: data._id,
                                  }
                                  deleteRole(datas)
                                    .then(() => {
                                      toast.success('Deleted successfully!')
                                      getroll()
                                    })
                                    .catch((error) => {
                                      toast.error(
                                        error?.response?.data?.message || 'Error occurred',
                                      )
                                    })
                                }
                              }}
                            ></Icons.DeleteRounded>
                          )}
                          {permission.includes('role.edit') && (
                            <Icons.EditRounded
                              className="editButton"
                              onClick={() => {
                                navigate('/roleform', {
                                  state: { editData: data },
                                })
                              }}
                            ></Icons.EditRounded>
                          )}
                        </CCol>
                      </CRow>
                    </CCardHeader>
                    <CCardBody>
                      {data.permission.length > 0 ? (
                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '5px',
                          }}
                        >
                          {data.permission.map((permission, index) => (
                            <span
                              key={index}
                              style={{
                                backgroundColor: '#7c87f2',
                                padding: '5px',
                                color: 'white',
                                borderRadius: '20px',
                              }}
                            >
                              {permission}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <h>Permission Not Allow</h>
                      )}
                    </CCardBody>
                  </CCard>
                ))}
            </CCol>
          </CRow>
        )}
      </CContainer>
      {/* )} */}
    </>
  )
}

export default Role
