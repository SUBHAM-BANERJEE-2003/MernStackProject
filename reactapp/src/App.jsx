import React, { useState,useEffect } from 'react';
import axios from 'axios';

function App() {
  const [word, setWord] = useState('');
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [repos, setRepos] = useState([]);

  const fetchData = () => {
    if (!word || !url) {
      console.error("Word and URL are required.");
      return;
    }

    axios.get(`http://localhost:5000/?url=${encodeURIComponent(url)}&word=${encodeURIComponent(word)}`)
      .then(response => {
        setResult(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setResult(null); // Clear result on error
      });
  };

  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState(null);

  const searchUser = async () => {
    try {
      const response = await axios.get(`https://api.github.com/users/${username}`);
      setUserData(response.data);

      const reposResponse = await axios.get(`https://api.github.com/users/${username}/repos`);
      setRepos(reposResponse.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserData(null); // Clear user data on error
      setRepos([]);
    }
  };

  useEffect(() => {
    // Fetch initial user data
    searchUser();
  }, [username]);

  return (
    <>
      <div style={{ textAlign: "center", fontSize: "30px", fontWeight: "bold" }}>
        Simple Web Scraper Using React And Flask
      </div>

      <div className="container">
        <div className="formbody">
          <form>
            <label htmlFor="websitename">
              Enter the name of the website:
              <input type="text" className='name' value={url} onChange={(e) => setUrl(e.target.value)} />
            </label>
            <label>
              Word:
              <input type="text" value={word} onChange={(e) => setWord(e.target.value)} />
            </label>
            <button type="button" className='submitbtn' onClick={fetchData}>Submit</button>
          </form>
        </div>
      </div>

      {result ? (
        <div id="result">
          The word '{result.word}' appears {result.occurrences} times on the page.
        </div>
      ) : (
        <div id="result">Waiting for data...</div>
      )}
      <div class="container">
      <div class="formbody">
        <label>
          Enter GitHub username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <button onClick={searchUser}>Search</button>
        {userData ? (
          <div className='card-container'>
            <div className='wrapper'>
            <div className='user_img' style={{ backgroundImage: `url(${userData.avatar_url})` }}></div>
            <a href={`${userData.html_url}`}><h1 className="card_title">{userData.login}</h1></a>
            <p className='para_card'> Name: {userData.name}</p>
            <p className='para_card'> Followers: {userData.followers}</p>
            <p className='para_card'> Public Repository: {userData.public_repos}</p>
            <p className='para_card'> Following: {userData.following}</p>
            <p className='para_card'> Bio: {userData.bio}</p>
            <p className='para_card'> Joined-at: {userData.created_at.substring(0, 10)}</p>
            <div class="button-wrapper"> 
              {repos.slice(0, 4).map(repo => (
              <button key={repo.id} className="btnfill" onClick={() => window.open(repo.html_url, '_blank')}>
                {repo.name}
              </button>
               ))}
            </div>
            </div>
          </div>
        ) : (
          <div>No user data available.</div>
        )}
        </div>
      </div>
    </>
  );
}

export default App;
