import { useState, useEffect } from 'react'
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
import { changepermission, getallRole } from 'src/redux/api/api'
import { toast, ToastContainer } from 'react-toastify'
import { Button, IconButton } from '@mui/material'
import 'react-toastify/dist/ReactToastify.css'
import Switch from '@mui/material/Switch'
import { useNavigate } from 'react-router-dom'
import * as Icons from '@mui/icons-material'

const Permission = () => {
  const [roles, setRoles] = useState([])
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

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
    getroll()
  }, [])

  const handleSwitchChange = (roleId, field) => async (event) => {
    try {
      setIsLoading(true)
      const data = {
        name: roleId,
        permission: field,
      }

      const res = await changepermission(data)

      toast.success('Permission updated successfully')
      await getroll()
      setIsLoading(false)
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'An error occurred')
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* {isLoading ? (
        <div className="d-flex justify-content-center">
          <CSpinner className="theme-spinner-color" />
        </div>
      ) : ( */}
      <CContainer>
        <ToastContainer draggable />
        {roles.length > 0 && (
          <CRow>
            <CCol md={12} xl={6}>
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
              {roles
                .filter((data) => data.name !== 'superadmin')
                .map((data) => (
                  <CCard key={data._id} className="mb-2">
                    <CCardHeader>
                      <CRow>
                        <CCol md={11} xl={11}>
                          {data.name}
                        </CCol>
                        {/* <CCol md={1} xl={1}>
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
                              deleteCategory(value)
                                .then(() => {
                                  toast.success('Deleted successfully!', {
                                    key: value,
                                  })
                                  console.log(value)
                                  categoryList()
                                })
                                .catch(() => {
                                  toast.error('Something went wrong!', {
                                    key: value,
                                  })
                                })
                            }
                          }}
                        ></Icons.DeleteRounded>
                      </CCol> */}
                      </CRow>
                    </CCardHeader>
                    <CCardBody>
                      <CContainer>
                        <span style={{ marginRight: '20px' }}>Insert</span>
                        <Switch
                          checked={data.insert}
                          onChange={handleSwitchChange(data.name, 'insert')}
                        />
                      </CContainer>
                      <CContainer>
                        <span style={{ marginRight: '9px' }}>Update</span>
                        <Switch
                          checked={data.update}
                          onChange={handleSwitchChange(data.name, 'update')}
                        />
                      </CContainer>
                      <CContainer>
                        <span style={{ marginRight: '14px' }}>Delete</span>
                        <Switch
                          checked={data.delete}
                          onChange={handleSwitchChange(data.name, 'delete')}
                        />
                      </CContainer>
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

export default Permission
