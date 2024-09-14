import { useState, useEffect } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CContainer, CFormCheck, CRow } from '@coreui/react'
import { changepermission, getallRole } from 'src/redux/api/api'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Switch from '@mui/material/Switch'

const Permission = () => {
  const [roles, setRoles] = useState([]) // State to store roles

  const getroll = async () => {
    try {
      const res = await getallRole()
      setRoles(res.data.info) // Ensure the data format is correct
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch roles')
    }
  }

  useEffect(() => {
    getroll()
  }, [])

  const handleSwitchChange = (roleId, field) => async (event) => {
    try {
      const data = {
        name: roleId,
        permission: field,
      }

      const res = await changepermission(data)

      toast.success('Permission updated successfully')
      getroll()
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'An error occurred')
    }
  }

  return (
    <CContainer>
      <ToastContainer draggable />
      {roles.length > 0 && (
        <CRow>
          <CCol md={12} xl={6}>
            {roles
              .filter((data) => data.name !== 'superadmin') // Filter roles that are not 'superadmin'
              .map((data) => (
                <CCard key={data._id} className="mb-2">
                  <CCardHeader>{data.name}</CCardHeader>
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
  )
}

export default Permission
