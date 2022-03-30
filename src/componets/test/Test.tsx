import React, { FC, useCallback, useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';

const url = 'https://api.sport24.ua/sports/getAll';


// const getData = () => {
//   return axios.get(url).then((response) => {
//     console.log(response.data);
//     return true;
//   }).catch((error) => {
//     console.log(error)
//     return false
//   })
// }

const getData = async () => {
  try {
    // const response = await axios.get<{id: number, name:string, titleUa: string}[]>(url);
    const response = (await delayedFetch()) as AxiosResponse<{ id: number, name: string, titleUa: string }[]>;
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
const delayedFetch = () => new Promise((resolve) => {
  setTimeout(() => {
    const d = async () => {
      const response = await axios.get<{ id: number, name: string, titleUa: string }[]>(url)
      resolve(response);
    }
    void d();
  }, 2000)
})
export const Test = () => {

  const [loading, setLoading] = useState(false);

  const [data, setData] = useState<Array<{ id: number, name: string, titleUa: string }>>([]);

  useEffect(() => {
    // getData().then((data) => {
    //   setData(data)
    //   console.log(data);
    // });

    const fetchData = async () => {
      setLoading(true);
      const serverData = await getData();
      setData(serverData || []);
      setLoading(false);
    }
    void fetchData();
  }, []);


  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/users">Users</Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/"></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/users" element={<Users />}></Route>
      </Routes>
      <div>
        {loading ? <div>Loading...</div> :
          (<ul>
            {data.map(d => (<ListElement key={d.id} name={d.name} titleUa={d.titleUa}/>))}
          </ul>)}
      </div>
    </Router>
  )
}

const ListElement: FC<{ name: string, titleUa: string }> = (props) => {
  const [expand, setExpand] = useState(false)


  const showTitle = useCallback(() => {
    setExpand((prevExpand) => {
        return !prevExpand
      }
    )
  }, [])

  return (
    <li onClick={showTitle}>{props.name} {expand && <span> - {props.titleUa}</span>}</li>
  )
}

function Home() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}
