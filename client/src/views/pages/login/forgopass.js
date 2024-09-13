import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormFeedback,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { useForm } from 'react-hook-form'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const [step, setStep] = useState(1) // Manage steps for email, OTP, and change password
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleEmailSubmit = async (data) => {
    setIsLoading(true)
    try {
      // Call the checkEmail API here
      const res = await checkEmailAPI(data.email) // Implement checkEmailAPI accordingly
      if (res.status === 200) {
        toast.success('OTP sent to your email!')
        setEmail(data.email)
        setStep(2)
      } else {
        toast.error(res.data.message || 'Email verification failed!')
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again!')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpSubmit = async (data) => {
    setIsLoading(true)
    try {
      // Call the verifyOtp API here
      const res = await verifyOtpAPI({ email, otp: data.otp }) // Implement verifyOtpAPI accordingly
      if (res.status === 200) {
        toast.success('OTP verified successfully!')
        setStep(3)
      } else {
        toast.error(res.data.message || 'OTP verification failed!')
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again!')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePasswordSubmit = async (data) => {
    setIsLoading(true)
    try {
      // Call the changePassword API here
      const res = await changePasswordAPI({
        email,
        password: data.password,
        confpassword: data.confpassword,
      }) // Implement changePasswordAPI accordingly
      if (res.status === 200) {
        toast.success('Password changed successfully!')
        setStep(1)
      } else {
        toast.error(res.data.message || 'Failed to change password!')
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again!')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <ToastContainer />
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <CCard>
              <CCardBody>
                {step === 1 && (
                  <CForm onSubmit={handleSubmit(handleEmailSubmit)}>
                    <h3>Forgot Password</h3>
                    <p>Enter your email to receive OTP.</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="email"
                        placeholder="Email"
                        {...register('email', { required: 'Email is required' })}
                        invalid={!!errors.email}
                      />
                      {errors.email && (
                        <CFormFeedback invalid>{errors.email.message}</CFormFeedback>
                      )}
                    </CInputGroup>
                    <CButton color="primary" type="submit" disabled={isLoading}>
                      {isLoading ? 'Sending...' : 'Send OTP'}
                    </CButton>
                  </CForm>
                )}
                {step === 2 && (
                  <CForm onSubmit={handleSubmit(handleOtpSubmit)}>
                    <h3>Verify OTP</h3>
                    <p>Enter the OTP sent to your email.</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>#</CInputGroupText>
                      <CFormInput
                        type="text"
                        placeholder="OTP"
                        {...register('otp', { required: 'OTP is required' })}
                        invalid={!!errors.otp}
                      />
                      {errors.otp && <CFormFeedback invalid>{errors.otp.message}</CFormFeedback>}
                    </CInputGroup>
                    <CButton color="primary" type="submit" disabled={isLoading}>
                      {isLoading ? 'Verifying...' : 'Verify OTP'}
                    </CButton>
                  </CForm>
                )}
                {step === 3 && (
                  <CForm onSubmit={handleSubmit(handleChangePasswordSubmit)}>
                    <h3>Change Password</h3>
                    <p>Enter your new password.</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="New Password"
                        {...register('password', { required: 'Password is required' })}
                        invalid={!!errors.password}
                      />
                      {errors.password && (
                        <CFormFeedback invalid>{errors.password.message}</CFormFeedback>
                      )}
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Confirm Password"
                        {...register('confpassword', { required: 'Confirm password is required' })}
                        invalid={!!errors.confpassword}
                      />
                      {errors.confpassword && (
                        <CFormFeedback invalid>{errors.confpassword.message}</CFormFeedback>
                      )}
                    </CInputGroup>
                    <CButton color="primary" type="submit" disabled={isLoading}>
                      {isLoading ? 'Changing...' : 'Change Password'}
                    </CButton>
                  </CForm>
                )}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default ForgotPassword
