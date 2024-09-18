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
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { addRole } from 'src/redux/api/api'

const Role = () => {
  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    control,
    clearErrors,
    formState: { errors },
  } = useForm()

  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)
      const res = await addRole(data)
      if (res.data.info) {
        setIsLoading(false)
        navigate('/permission')
      }
    } catch (error) {
      console.log(error)
      setIsLoading(false)
      toast.error(error.response?.data?.message || 'Error occurred ')
    }
  }
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
                  <CForm className=" row g-3" onSubmit={handleSubmit(onSubmit)}>
                    <CCol xl={12} md={12}>
                      <CFormLabel>Role Name</CFormLabel>
                      <CFormInput
                        type="text"
                        placeholder="Role Name"
                        {...register('name', { required: 'Role Name is required' })}
                        invalid={!!errors.name}
                      />

                      <CFormFeedback invalid> Name is required</CFormFeedback>
                    </CCol>
                    <CCol xl={12} md={12}>
                      Permission
                    </CCol>
                    <CCol xl={3} md={12}>
                      <CFormCheck label="Insert" {...register('insert')}></CFormCheck>
                    </CCol>
                    <CCol xl={3} md={12}>
                      <CFormCheck label="Update" {...register('update')}></CFormCheck>
                    </CCol>
                    <CCol xl={3} md={12}>
                      <CFormCheck label="Delete" {...register('delete')}></CFormCheck>
                    </CCol>
                    <CCol md={12} className="text-center submitButton">
                      {isLoading ? (
                        <CButton disabled>
                          <CSpinner component="span" size="sm" aria-hidden="true" />
                          Loading...
                        </CButton>
                      ) : (
                        <CButton type="submit" className="AddButton">
                          Add
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
