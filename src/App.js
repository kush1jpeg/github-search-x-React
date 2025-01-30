import Table from 'react-bootstrap/Table';
import './App.css';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Accordion from 'react-bootstrap/Accordion';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';


function App() {
  const [key, setKey] = useState('home');
  const [count, setCount] = useState(1);
  const [loaded, setloaded] = useState(false);//for changing the transform
  const [show, setShow] = useState(false);//for alert
  const [name, setname] = useState('') //for username
  const [prof, newprof] = useState([]) //profile
  const [follower, setfollower] = useState([]) //follower
  const [following, setfollowing] = useState([])//following
  const [repo, setrepo] = useState([]) //user repo
  const [folwerrepo, setfolwerrepo] = useState([])//followers repo
  const [folingrepo, setfolingrepo] = useState([])//following repo
  const [loading, setLoading] = useState(false); // Tracks if the data is loading

  // const load = document.getElementsByClassName('load')
  // Array.from(load).forEach((e) => {
  //   if (count<1)
  //     { e.style.display = 'none'} else{e.style.display='block'}    
  // });
  //                                 
  //                                   ##   React maintains a virtual DOM, and directly manipulating the real DOM 
  //                                 (like with e.style.display) can cause React's state to become out of sync with the DOM.


  const setrepofollower = async (followers) => {
    try {
      setLoading(true);

      for (const x of followers) {
        let page = 1;
        let allRepos = [];

        while (true) {
          const res = await fetch(`https://api.github.com/users/${x.login}/repos?page=${page}&per_page=100`);
          const data = await res.json();

          if (data.length === 0) {
            break;
          }

          allRepos = [...allRepos, ...data];
          page += 1;
        }

        // Update for this specific follower
        setfolwerrepo((prev) => ({
          ...prev, [x.login]: allRepos
        }
          
        ));
      }

      setLoading(false);
    } catch (error) {
      console.error(error + " fetching repos");
      setLoading(false);
    }

  };
  //
  const setfollowingrepo = async (following) => {
    try {
      setLoading(true);

      for (const x of following) {
        let page = 1;
        let allRepos = [];

        while (true) {
          const res = await fetch(`https://api.github.com/users/${x.login}/repos?page=${page}&per_page=100`);
          const data = await res.json();

          if (data.length === 0) {
            break;
          }

          allRepos = [...allRepos, ...data];
          page += 1;
        }

        // Update for this specific follower
        setfolingrepo((prev) => ({
          ...prev, [x.login]: allRepos
        }
          
        ));
      }

      setLoading(false);
    } catch (error) {
      console.error(error + " fetching repos");
      setLoading(false);
    }

  };
  //

  const setrepomy = async (p) => {
    let page = 1;
    let allRepos = [];
    try {
      while (true) {
        setLoading(true)
        const res = await fetch(`https://api.github.com/users/${p}/repos?page=${page}&per_page=100`);
        const data = await res.json();
        if (data.length === 0) {
          break;
        } else {

          allRepos = [...allRepos, ...data]; // Append the new repos to the existing array
          page += 1;
        }

      }
      if (allRepos === 0) { setrepo(0) }
      else {
        setrepo(allRepos);

      }


      setLoading(false)

    } catch (error) {
      console.error(error + " fetching repos");
    }
  };

  const nameset = (p) => {
    setname(p)
    search(p)
  }







  //get follower for profile
  const getfollower = async (user) => {
    try {
      const res = await fetch(`https://api.github.com/users/${user}/followers`)
      const data = await res.json()
      setfollower(data)
      setrepofollower(data)
      console.log("Follower data:", data);
    } catch (error) {
      console.error(error)
    }
  }

  //get following for profile
  const getfollowing = async (user) => {
    try {
      const res = await fetch(`https://api.github.com/users/${user}/following`)
      const data = await res.json()
      setfollowing(data)
      setfollowingrepo(data)
      console.log("Following data:", data);
    }
    catch (e) {
      console.error("not able to get the followers" + e)
    }
  }


  async function search() {

    try {
      const res = await fetch(`https://api.github.com/search/users?q=${name}`);
      const data = await res.json();

      console.log("Search results:", data);
      if (data.items && data.items.length > 0) {
        const user = data.items[0];
        newprof(user); // Save the profile data
        getfollower(user.login);
        setrepomy(user.login)
        getfollowing(user.login);
        setShow(false)
      } else {
        setfollower([]); // Clear followers in case of errors
        setfollowing([])
        setfolingrepo([])
        setrepomy([])
        getfollower([])
        setrepo([]);
        newprof({});
        setShow(true, console.log('this'))
        setCount( 1)
      }
    } catch (error) {
      console.error("Error fetching user: " + error);
      setfollower([]);
      setfollowing([])
      setShow(true)
    }
  }


  return (<>
    {show == true ? (
      <Alert variant="danger" className='alert' onClose={() => setShow(false)} dismissible>
        <Alert.Heading>You tripping or wrong ID entered</Alert.Heading>
      </Alert>
    ) : ''}

    <div className="App">
      <h1>Github-Search</h1>
      <input
        type="text"
        onKeyDown={(e) => {
          if (e.key == 'Enter') {
            search();
            setloaded(true);
          }
        }}
        placeholder="Enter GitHub username"
        id="github-username" value={name} onChange={(e) => { setname(e.target.value) }} />
      <button className="search-button"
        onClick={() => {
          setloaded(true);
          search();
          setCount((count) => {
            console.log(count + ' =count');
            return count = 0;
          });
        }}
      > Search
      </button>
    </div>
    <div className=" wrapper ">
    <Card style={{ width: '15rem', display: count == 1 || show === true ? 'none' : 'block' }}>
      <Card.Img variant="top" src={prof?.avatar_url} />
      <Card.Body>
        <div className='wrap'><Card.Title>{prof.login}</Card.Title>
        <Button className="button" variant="warning" href={prof.html_url}
          target="_blank"> Visit Profile</Button></div>
      </Card.Body>
    </Card>

   <div className="wrap2">
       {/*  */}
        <div style={{ display: count === 1 || show === true ? 'none' : 'block', pointerEvents: 'none', border: "0" }}>
            <div className="repo-box" style={{
                pointerEvents: 'none',
                width: "15vw",
                fontSize: "large",
                display: 'flex', // Flexbox for alignment
                alignItems: 'center', // Center items vertically
            }}>
                Repositories:
                {loading ? (
                    <Spinner animation="border" style={{ width: '1rem', height: '1rem', marginLeft: '8px' }} />
                ) : (
                    ` ${repo.length}`
                )}
            </div>
        </div>
        {/*  */}
        <div style={{ display: count === 1 || show === true ? 'none' : 'block', pointerEvents: 'none', border: "0" }}>
            <div className="repo-box" style={{
                pointerEvents: 'none',
                width: "15vw",
                fontSize: "large",
                display: 'flex', // Flexbox for alignment
                alignItems: 'center', // Center items vertically
            }}>
                Follower:
                {loading ? (
                    <Spinner animation="border" style={{ width: '1rem', height: '1rem', marginLeft: '8px' }} />
                ) : (
                    ` ${follower.length}`
                )}
            </div>
        </div>
        {/*  */}
        <div style={{ display: count === 1 || show === true ? 'none' : 'block', pointerEvents: 'none', border: "0" }}>
            <div className="repo-box" style={{
                pointerEvents: 'none',
                width: "15vw",
                fontSize: "large",
                display: 'flex', // Flexbox for alignment
                alignItems: 'center', // Center items vertically
            }}>
                Following:
                {loading ? (
                    <Spinner animation="border" style={{ width: '1rem', height: '1rem', marginLeft: '8px' }} />
                ) : (
                    ` ${following.length}`
                )}
            </div>
        </div>
        {/*  */}
        
        </div>
        <div style={{ display: count === 1 || show === true ? 'none' : 'block', pointerEvents: 'none', border: "0" }}>
            <div className="repo-box" style={{
                pointerEvents: 'none',
                width: "55vw",
                height:'42vh',
                fontSize: "large",
                display: 'flex', // Flexbox for alignment
                alignItems: 'center', // Center items vertically
            }}>
                
                {loading ? (
                    <Spinner animation="border" style={{ width: '1rem', height: '1rem', marginLeft: '8px' }} />
                ) : (
                    `${prof.bio !== undefined ? ('Bio: '+ prof.bio ): ' No bio bruh'}`
                )}
            </div>
        </div>
</div>
<div className="container1" style={{ display: count == 1 || show ? 'none' : 'block' }}>
  <Tabs  style={{ display: count == 1 || show ? 'none' : 'block' }}
  id="controlled-tab-example"
  activeKey={key}
  onSelect={(k) => setKey(k)}
  className="mb-3 nav nav-tabs d-flex"
 
>
  <Tab eventKey="Repositories" title="Repositories" className='taab custom' style={{display: count == 1 || show === true ? 'none' : 'block' }}>
    <Table striped bordered hover className='' style={{ minHeight: '200px' , width: '95vw' , marginLeft:"-630px" , position:"absolute" , display: count == 1 || show === true ? 'none' : 'block' }}>
      <thead>
        <tr>
          <th>Repositories</th>
          <th>Description</th>
          <th>Visibility</th>
        </tr>
      </thead>
      <tbody>
        {repo && repo.length > 0 ? (
          repo.map((p) => (
            <tr key={p.id}>
              <td>{p.full_name}</td>
              <td>{p.description}</td>
              <td>{p.visibility}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="3" className="text-center align-middle" style={{ height: "100px" }}>
              No Repos Found
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  </Tab>

  <Tab eventKey="Follower" title="Follower">
    <Table striped bordered hover className='w-100' style={{ minHeight: '200px' , display: count == 1 || show === true ? 'none' : 'block'  }}>
      <thead>
        <tr>
          <th>Github-name</th>
          <th>Visibility</th>
          <th>Repos</th>
        </tr>
      </thead>
      <tbody>
        {follower && follower.length > 0 ? (
          follower.map((p) => (
            <tr key={p.id}>
              <td onClick={() => nameset(p.login)}>
                <img src={p.avatar_url} alt="avatar" className="rounded-circle" style={{ width: '30px' }} />
                {p.login}
              </td>
              <td>{p.user_view_type}</td>
              <td>{loading || folwerrepo[p.login] === undefined ? <Spinner animation="border" size="sm" /> : folwerrepo[p.login]?.length || 0}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="3" className="text-center align-middle" style={{ height: "100px" }}>
              No Followers Found
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  </Tab>

  <Tab eventKey="Following" title="Following">
    <Table striped bordered hover className='w-100' style={{ minHeight: '200px' ,  marginTop: '19vh', display: count == 1 || show === true ? 'none' : 'block'   }}>
      <thead>
        <tr>
          <th>Github-name</th>
          <th>Visibility</th>
          <th>Repos</th>
        </tr>
      </thead>
      <tbody>
        {following && following.length > 0 ? (
          following.map((p) => (
            <tr key={p.id}>
              <td onClick={() => nameset(p.login)}>
                <img src={p.avatar_url} alt="avatar" className="rounded-circle" style={{ width: '30px' }} />
                {p.login}
              </td>
              <td>{p.user_view_type}</td>
              <td>{loading || folingrepo[p.login] === undefined ? <Spinner animation="border" size="sm" /> : folingrepo[p.login]?.length || 0}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="3" className="text-center align-middle" style={{ height: "100px" }}>
              No Following Found
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  </Tab>
</Tabs>
</div>
  </>
  )
}

export default App;



