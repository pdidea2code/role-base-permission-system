import { cilListNumbered, cilLockLocked, cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormFeedback,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import { useForm } from 'react-hook-form'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useState, useEffect } from 'react'
import { changePassword, sendOtp, verifyOtp } from 'src/redux/api/api'
import { Button, notification } from 'antd'

const Forgotpassword = () => {
  const [api, contextHolder] = notification.useNotification()
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    clearErrors,
    formState: { errors },
    watch,
  } = useForm()
  const [countdown, setCountdown] = useState(0)
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  const [done, setDone] = useState(true)
  const [email, setEmail] = useState('')

  const password = watch('password')
  const confpassword = watch('confpassword')

  const onSubmit = async (data) => {
    if (password !== confpassword) {
      api.open({
        message: 'Notification Title',
        description:
          'I will never close automatically. This is a purposely very very long description that has many many characters and words.',
        duration: 0,
      })
      toast.error('Passwords do not match')
      return
    }

    try {
      const dataforverify = { email: data.email, otp: data.otp }
      const dataforchang = {
        email: data.email,
        password: data.password,
        confpassword: data.confpassword,
      }

      const verifyRes = await verifyOtp(dataforverify)
      if (verifyRes.status === 401) {
        toast.error(verifyRes.message)
      } else {
        const changeRes = await changePassword(dataforchang)
        if (changeRes.status === 400) {
          toast.error('Error changing password')
        } else {
          toast.success('Password changed successfully!')
          setDone(true)
          setValue('otp', '')
          setValue('password', '')
          setValue('confpassword', '')
        }
      }
    } catch (error) {
      console.log(error)
      toast.error('An error occurred')
    }
  }

  const handleChange = (fieldName, fieldValue) => {
    if (fieldName === 'email') {
      setEmail(fieldValue)
    }
  }

  useEffect(() => {
    let timer
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1)
      }, 1000)
    } else {
      clearInterval(timer)
      setIsButtonDisabled(false)
    }

    return () => clearInterval(timer)
  }, [countdown])

  const handleSendOTP = async () => {
    try {
      const data = { email }
      const res = await sendOtp(data)

      if (res.status === 401) {
        toast.error('Error sending OTP')
      } else {
        setCountdown(60)
        setIsButtonDisabled(true)
        setDone(false)
        toast.success('OTP sent successfully!')
      }
    } catch (error) {
      console.log(error)
      api.open({
        message: 'An error occurred while sending OTP',
        // description:
        //   'I will never close automatically. This is a purposely very very long description that has many many characters and words.',
      })
      toast.error('An error occurred while sending OTP')
    }
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        {contextHolder}
        {/* <ToastContainer /> */}
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody>
                <CForm onSubmit={handleSubmit(onSubmit)}>
                  <h1 style={{ textAlign: 'center' }}>Forgot Password</h1>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      type="email"
                      placeholder="Email"
                      name="email"
                      {...register('email', { required: 'Email is required' })}
                      invalid={!!errors.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                    />
                    <CButton onClick={handleSendOTP} disabled={isButtonDisabled}>
                      {isButtonDisabled ? `Resend OTP in ${countdown}s` : 'Send OTP'}
                    </CButton>
                    <CFormFeedback invalid>{errors.email?.message}</CFormFeedback>
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <span>OTP</span>
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      placeholder="OTP"
                      name="otp"
                      {...register('otp', { required: 'OTP is required' })}
                      invalid={!!errors.otp}
                    />
                    <CFormFeedback invalid>{errors.otp?.message}</CFormFeedback>
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      name="password"
                      {...register('password', { required: 'Password is required' })}
                      invalid={!!errors.password}
                    />
                    <CFormFeedback invalid>{errors.password?.message}</CFormFeedback>
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Confirm Password"
                      name="confpassword"
                      {...register('confpassword', { required: 'Confirm password is required' })}
                      invalid={!!errors.confpassword || (password !== confpassword && confpassword)}
                    />
                    <CFormFeedback invalid>
                      {errors.confpassword?.message || 'Passwords do not match'}
                    </CFormFeedback>
                  </CInputGroup>
                  <CRow className="mt-4">
                    <CCol xs={6}>
                      <CButton disabled={done} color="primary" type="submit" className="px-4">
                        Done
                      </CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Forgotpassword
