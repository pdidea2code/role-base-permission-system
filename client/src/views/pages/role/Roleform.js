import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CForm,
  CFormCheck,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CRow,
  CSpinner,
} from '@coreui/react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { addRole, changepermission, getPermission } from 'src/redux/api/api'

const Role = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm()

  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const [permissions, setPermissions] = useState([])
  const [groupedPermissions, setGroupedPermissions] = useState({})
  const [isUpdate, setIsUpdata] = useState('')
  const { state } = useLocation()

  // Function to submit the form
  const onSubmit = async (data) => {
    const selectedPermissions =
      Object.keys(data)
        .filter((key) => key.startsWith('permission_') && data[key] === true)
        .map((key) => key.replace('permission_', '')) || []

    setIsLoading(true)
    try {
      if (isUpdate !== '') {
        const datas = {
          name: data.name,
          id: isUpdate,
          permission: selectedPermissions,
        }
        const res = await changepermission(datas)
        if (res.data.info) {
          navigate('/role')
        }
      } else {
        const datas = {
          name: data.name,

          permission: selectedPermissions,
        }
        const res = await addRole(datas)
        if (res.data.info) {
          navigate('/role')
        }
      }
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || 'An unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  // Function to get permission data from the API and group it
  const getPermissionData = async () => {
    setIsLoading(true)
    try {
      const res = await getPermission()
      const data = res.data.info

      // Group permissions by their prefix
      const grouped = data.reduce((acc, perm) => {
        const label = perm.name.split('.')[0]
        if (!acc[label]) {
          acc[label] = []
        }
        acc[label].push(perm)
        return acc
      }, {})
      setGroupedPermissions(grouped)
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch permission data and prefill form if updating
  useEffect(() => {
    const fetchData = async () => {
      await getPermissionData()
      if (state.editData) {
        setIsUpdata(state.editData._id)
        setValue('name', state.editData.name)
      }
    }
    fetchData()
  }, [state, setValue])

  return (
    <>
      <div className="bg-light min-vh-100">
        <ToastContainer />
        <CContainer className="mt-3">
          <CRow>
            <CCol md={6}>
              <CCard>
                <CCardHeader>Role Form</CCardHeader>
                <CCardBody>
                  <CForm className="row g-3" onSubmit={handleSubmit(onSubmit)}>
                    <CCol xl={12} md={12}>
                      <CFormLabel>Role Name</CFormLabel>
                      <CFormInput
                        type="text"
                        placeholder="Role Name"
                        {...register('name', { required: 'Role Name is required' })}
                        invalid={!!errors.name}
                      />
                      {errors.name && <CFormFeedback> Name is required</CFormFeedback>}
                    </CCol>
                    <CCol xl={12} md={12}>
                      <b>
                        <CFormLabel>Permission</CFormLabel>
                      </b>
                    </CCol>

                    {/* Only render the permission checkboxes if groupedPermissions is populated */}
                    {isLoading ? (
                      <CSpinner />
                    ) : (
                      Object.keys(groupedPermissions).map((label) => (
                        <div key={label}>
                          <span>{label}</span>
                          {groupedPermissions[label].map((perm) => (
                            <CFormCheck
                              key={perm._id}
                              type="checkbox"
                              label={perm.name}
                              defaultChecked={
                                state?.editData?.permission?.includes(perm.name) || false
                              }
                              {...register(`permission_${perm._id}`, { type: 'boolean' })}
                            />
                          ))}
                        </div>
                      ))
                    )}

                    <CCol md={12} className="text-center submitButton">
                      {isLoading ? (
                        <CButton disabled>
                          <CSpinner component="span" size="sm" aria-hidden="true" />
                          Loading...
                        </CButton>
                      ) : (
                        <CButton type="submit" className="AddButton">
                          {isUpdate ? 'Update' : 'Add'}
                        </CButton>
                      )}
                    </CCol>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </>
  )
}

export default Role
