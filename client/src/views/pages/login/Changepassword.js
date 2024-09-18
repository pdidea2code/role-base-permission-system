import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormFeedback,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked } from '@coreui/icons'
import { useForm } from 'react-hook-form'
import { changePassword, resetPassword } from 'src/redux/api/api' // Assume API function for password change
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Cookies from 'js-cookie'

const ChangePassword = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm()
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    setError('')
    setIsLoading(true)
    try {
      const res = await resetPassword(data)

      if (res.status === 400 || res.data.success === false) {
        setError(res.data.message)
        setIsLoading(false)
      } else {
        toast.success('Password changed successfully!')
        setIsLoading(false)
        setValue('password', '')
        setValue('newPassword', '')
        setValue('confirmPassword', '')
      }
    } catch (err) {
      setError(err.response.data.message)
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <ToastContainer />
        <CRow className="justify-content-center">
          <CCol md={5}>
            <CCardGroup>
              <CCard className="p-4 col-md-7">
                <CCardBody>
                  <CForm onSubmit={handleSubmit(onSubmit)}>
                    <h1>Change Password</h1>
                    <p className="text-medium-emphasis">Enter your new password</p>
                    <div in={error}>
                      <p className="errors">{error ? error : ''}</p>
                    </div>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Current Password"
                        {...register('password', {
                          required: 'Current password is required',
                        })}
                        invalid={!!errors.currentPassword}
                      />
                      <CFormFeedback invalid>Current password is required</CFormFeedback>
                    </CInputGroup>

                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="New Password"
                        {...register('newPassword', {
                          required: 'New password is required',
                        })}
                        invalid={!!errors.newPassword}
                      />
                      <CFormFeedback invalid>New password is required</CFormFeedback>
                    </CInputGroup>

                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Confirm Password"
                        {...register('confirmPassword', {
                          required: 'Please confirm your password',
                          validate: (value) =>
                            value === watch('newPassword') || 'Passwords do not match',
                        })}
                        invalid={!!errors.confirmPassword}
                      />
                      <CFormFeedback invalid>{errors.confirmPassword?.message}</CFormFeedback>
                    </CInputGroup>

                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" type="submit" className="px-4">
                          Change Password
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <Link to="/dashboard">
                          <CButton color="link" className="px-0">
                            Cancel
                          </CButton>
                        </Link>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default ChangePassword
