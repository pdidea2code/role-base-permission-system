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
import { cilLockLocked, cilUser } from '@coreui/icons'
import { useForm } from 'react-hook-form'
import { userLogin } from 'src/redux/api/api'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Cookies from 'js-cookie'
import { useDispatch } from 'react-redux'
import { LOGIN_SUCCESS } from 'src/redux/actions/action'

const Login = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState()
  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    control,
    clearErrors,
    formState: { errors },
  } = useForm()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const onSubmit = async (data) => {
    setError('')
    setIsLoading(true)
    try {
      const res = await userLogin(data)

      if (res.status === 400 || res.data.success === false) {
        setError(res.data.message)
        setIsLoading(false)
      } else {
        Cookies.set('token', res.data.info.token)
        Cookies.set('refreshToken', res.data.info.refreshToken)

        const userObject = {
          name: res.data.info.user.name,
          id: res.data.info.user._id,
          email: res.data.info.user.email,
          role: res.data.info.user.role.name,
          img: res.data.info.user.image ? res.data.baseUrl + res.data.info.user.image : null,
        }

        Cookies.set('admin', JSON.stringify(userObject))

        setIsLoading(false)
        dispatch({
          type: LOGIN_SUCCESS,
          data: userObject,
        })
        // navigate('/dashboard')
      }
    } catch (err) {
      if (err.response && (err.response.status === 401 || !err.response.data.success)) {
        setError(err.response.data.message)
        setIsLoading(false)
      } else {
        setError(err.response.data.message)
        setIsLoading(false)
      }
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
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">Sign In to your account</p>
                    <div in={error}>
                      <p className="errors">{error ? error : ''}</p>
                    </div>
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
                      />
                      <CFormFeedback invalid>Email is required</CFormFeedback>
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        name="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        {...register('password', { required: 'password is required' })}
                        invalid={!!errors.password}
                      />
                      <CFormFeedback invalid>Password is required</CFormFeedback>
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" type="submit" className="px-4">
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <Link to="/forgotpassword">
                          <CButton color="link" className="px-0">
                            Forgot password?
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

export default Login
