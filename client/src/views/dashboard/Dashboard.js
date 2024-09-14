import MUIDataTable from 'mui-datatables'
import { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { getUser } from 'src/redux/api/api'

const Dashboard = () => {
  const [dataTableData, setDataTabledata] = useState([])
  const [baseUrl, setBaseUrl] = useState('')
  const getuser = async () => {
    try {
      const res = await getUser()
      setDataTabledata(res.data.info)
      setBaseUrl(res.data.baseUrl)
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'An error occurred')
    }
  }
  useEffect(() => {
    getuser()
  }, [])
  return (
    <>
      <ToastContainer />
      {/* <MUIDataTable title={'user'} data={dataTableData} columns={columns} options={options} /> */}
    </>
  )
}

export default Dashboard
