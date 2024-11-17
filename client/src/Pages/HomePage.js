import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProgressBar from 'react-bootstrap/ProgressBar';
import NavBar from '../Components/NavBar';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';



const ImageContainer = styled.div`
  display: inline-block;
`;

const HeartbeatImage = styled.img`
  max-width:  200px;
  max-height: 200px;
  object-fit: cover;
`;
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("YOUR_GEMINI_API_KEY");
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

const HomePage = () => {
  // Retrieve user information from local storage
  const name = localStorage.getItem("name");
  const token = localStorage.getItem("token");
  // State to store results and loading status
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect to fetch results when the component mounts
  useEffect(() => {
    const fetchResults = async () => {
      try {
        // Fetch results from the Express API
        const expressApiUrl = 'http://localhost:9000/api/auth/results';
        const userEmail = localStorage.getItem('email');
        const userToken = localStorage.getItem('token');

        if (userEmail) {
          const expressResponse = await axios.post(
            expressApiUrl,
            { email: userEmail },
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          );

          // Set the results in the state
          setResults(expressResponse.data);

        } else {
          console.error('User email not found in local storage');
        }
      } catch (error) {
        console.error('Error fetching results:', error);
      } finally {
        // Set loading to false after fetching results
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  // State variables for greeting and fun fact
  const [greeting, setGreeting] = useState('');
  const [funFact, setFunFact] = useState('Loading...');
  const [tips, setTips] = useState([
   "Ensure consistent and accurate data for better healthcare outcomes through standardization! 🏥",
    "Adopt standardized formats to improve the reliability and comparability of your health data! 📊",
    "Use uniform data standards to make your medical records more interoperable across systems! 💻",
    "Standardizing clinical data ensures that your healthcare providers can make informed decisions faster! ⏱️",
    "Clinical data standardization helps enhance patient safety and the quality of care! 🛡️",
    "Better data standards lead to improved medical research and more effective treatments! 🔬",
    "Standardized clinical data makes it easier to share vital health information across institutions! 🏥",
    "Support data standardization for a seamless and efficient healthcare experience! 🌐"
  ]);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
    }, 6000);

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [tips]);
  // useEffect to set the greeting and generate a fun fact when the component mounts
  useEffect(() => {
    const currentTime = new Date().getHours();
    setGreeting(currentTime < 12 ? 'Good Morning' : currentTime < 16 ? 'Good Afternoon' : 'Good Evening');
    generateFunFact(); // Call the function to generate and set the fun fact text
  }, []);
  // Function to generate a fun fact using Google Generative AI
  const generateFunFact = async () => {
    const prompt = 'Give me an importan fact about clinical data standardization in healthcare.';
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      setFunFact(text);
    }
    catch (error) {
      setFunFact('Standardize your institute data for better healthcare outcomes through standardization! 🏥');
    }
  };
  // JSX structure for the HomePage component
  return (
    <>
      <style>
        {`
        body {
          padding-top: 40px;
        }

        .greeting-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-image: url("graybg.jpg");
          background-size: cover;
          margin: 0;
        }
        .tips-transition {
          transition: opacity 0.5s ease-in-out; // Add transition for opacity
        }
        .remaining-info-section {
          padding: 50px 0;
        }

        .tips-container {
          width: 100%;
          max-width: 80%; /* Adjust the maximum width as needed */
          margin: 0 auto;
          overflow: hidden;
        }

        .tips-transition {
          transition: opacity 0.5s ease-in-out;
        }

        .card {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .text-container {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }

        .image-container {
          margin-top: 20px; /* Adjust the margin as needed */
        }

        .footer {
          margin-top: 20px; /* Adjust the margin as needed */
        }
      `}
      </style>
      <NavBar />

      {/* Greeting Section */}
      <section className="greeting-section bg-purple text-white p-5">
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-lg-8">
              <div className="card rounded shadow-lg text-center" style={{ backgroundColor: '#333333' }}>
                <div className="card-body p-4 p-lg-5 d-flex align-items-center">
                  <div className="text-container">
                    <h2 className="fw-bold mb-3">
                      {greeting}, {name}!
                    </h2>
                    {results && results.previousResults && results.previousResults.length > 0 && (
                      <div>
                        <Link to="/results" className="result-link" style={{ textDecoration: 'none', color: 'white' }}>
                          <h4>Most Recent Result: <span style={results.previousResults[results.previousResults.length - 1].positive_probability > 70 ? { color: 'red' } : results.previousResults[results.previousResults.length - 1].positive_probability > 40 ? { color: 'yellow' } : { color: 'green' }}>{results.previousResults[results.previousResults.length - 1].positive_probability}%</span></h4>
                        </Link>
                        <ProgressBar
                          variant={results.previousResults[results.previousResults.length - 1].positive_probability > 70 ? "danger" : results.previousResults[results.previousResults.length - 1].positive_probability > 40 ? "warning" : "success"}
                          now={results.previousResults[results.previousResults.length - 1].positive_probability}
                          label={`${results.previousResults[results.previousResults.length - 1].positive_probability}%`}
                          max={100}
                          style={{
                            backgroundColor: '#334444',
                          }}
                          className="mb-2"
                        />
                      </div>
                    )}
                    <hr />
                    <div className="mb-4"></div>
                    <div className="tips-container">
                      <p className="lead tips-transition">
                        {tips.length > 0 && (
                          <b>{tips[currentTipIndex]}</b>
                        )}
                      </p>
                    </div>
                    <hr />
                    <p className="lead">
                      <b> </b>
                      {funFact}
                    </p>
                  </div>
                  <ImageContainer>
                    <HeartbeatImage
                      src="pixelheart.gif"
                      alt="Illustration"
                    />
                  </ImageContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Content Section */}
<section className="remaining-info-section additional-content py-5 text-white" style={{ backgroundColor: '#FF5252' }}>
  <div className="container">
    <div className="row">
      <div className="col-md-6">
        <h3 className="fw-bold mb-4">Discover the Future of Healthcare with Our Clinical Standardization & Interoperability Framework</h3>
        <p>
          Our commitment to improving healthcare has led us to create a cutting-edge framework that standardizes and enhances the interoperability of clinical data. Explore the powerful features that make our app a leader in healthcare data management and analysis.
        </p>
        <p>
          With the integration of advanced machine learning models such as Sentence Transformer and Word2Vec, we now provide near-instant insights into clinical data. These models allow us to accurately analyze patient records, ensuring that all data points are standardized for optimal interoperability across different healthcare systems. 
        </p>
        <p>
          Our app allows you to upload clinical documents and analyze trends with high precision. With the power of Sentence Transformer, we can understand the contextual meaning behind medical texts and provide you with insights that bridge the gap between different clinical systems. The Word2Vec model further enhances our ability to recognize relationships between medical terms and diagnoses, facilitating seamless data exchange across platforms.
        </p>
        <p className="fw-bold mt-3">Meet Our Team:</p>
        <ul>
          {/* Updated list of team members */}
          <li title='rubaiayat 🐭'>M. Rubaiyat Hossain Mondal</li>
          <li title='Syed'>Syed Ahmmed</li>
          {/* <li title='Sai Pratham'>Sesha Sai Pratiek Yeggina (22BD1A1253)</li>
          <li title='Frontend dev'>Siddharth Katrapalli (22BD1A1228)</li>
          <li title='???'>Srikar Veluvali (22BD1A1264)</li>
          <li title='SmashKarts'>U V N Vardhan (22BD1A1262)</li> */}
        </ul>
      </div>
      <div className="col-md-6">
        <h3 className="fw-bold mb-4">Embark on Your Journey to Standardized Healthcare</h3>
        <p>
          Start by exploring our revamped framework for clinical standardization. Powered by the latest machine learning models like Sentence Transformer, our app ensures near-accurate results that are customized to your specific healthcare needs.
        </p>
        <p>
          The self-assessment tool allows patients to upload their clinical records, which are then transformed into standardized data. The app utilizes Word2Vec to analyze the relationships between various medical conditions, ensuring that information is seamlessly integrated into healthcare systems for improved interoperability.
        </p>
        <p>
          The innovation doesn’t stop there. We’ve added an interactive feature that allows patients to query the system using natural language. Our AI-powered chatbot, enhanced by advanced text models, provides immediate insights and recommendations based on standardized clinical data.
        </p>
        <p>
          Taking assessments is straightforward and confidential. Your data remains secure while our framework ensures that it can be easily exchanged with healthcare providers worldwide, improving treatment efficiency and decision-making.
        </p>
      </div>
    </div>
  </div>
</section>

{/* <div className="container">
  <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
    <p className="col-md-4 mb-0 text-body-secondary">© Data Analytics Lab</p>
    <a href="/" className="col-md-4 d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
    </a>
  </footer>
</div> */}



      <div className="container">
        <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
          <p className="col-md-4 mb-0 text-body-secondary">© Data Analytics Lab</p>

          <a href="/" className="col-md-4 d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">

          </a>
        </footer>
      </div>

    </>
  );
};

export default HomePage;
