export const WRK_URL = 'http://localhost:5000/api/workers';
export const API_URL = 'http://localhost:5000';

interface AuthFetchProps {
    data: object,
    method: string,
    auth: string
}
type InviteFetchProps = {
  data: {
    phone_number: string;
    first_name: string;
    last_name: string;
  };
  method: string;
};

const fetchWorker = async (method: string, workerData?: any, companyID?: string | null) => {
    let options: RequestInit = { method };
    if (method === 'POST' && workerData) {
      options = {
        ...options,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workerData),
      };
    }
    let url= WRK_URL
    if (method === 'GET' && companyID) {
        url += `?companyID=${companyID}`;
      }
    
  
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  };

  export default fetchWorker

export function inviteFetch({data, method}:InviteFetchProps){
  return fetch(`http://localhost:5000/whatsapp`,{
    method: method,
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  })
  .then((res) => res.json())
    .then((data) => alert(data.message))
    .catch((error) => console.log(error))
}
export function authFetch({data, method, auth}: AuthFetchProps) {

    return fetch(`${API_URL}/${auth}`, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then((res) => res.json())
    .then((data) => alert(data.message))
    .catch((error) => console.log(error))
}