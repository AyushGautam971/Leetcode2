// import { useState, useEffect, useRef } from 'react';
// import { useForm } from 'react-hook-form';
// import Editor from '@monaco-editor/react';
// import { useParams } from 'react-router';
// import axiosClient from "../utils/axiosClient"
// import SubmissionHistory from "../components/SubmissionHistory"
// import ChatAi from '../components/ChatAi';
// import Editorial from '../components/Editorial';

// const langMap = {
//         cpp: 'C++',
//         java: 'Java',
//         javascript: 'JavaScript'
// };


// const ProblemPage = () => {
//   const [problem, setProblem] = useState(null);
//   const [selectedLanguage, setSelectedLanguage] = useState('javascript');
//   const [code, setCode] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [runResult, setRunResult] = useState(null);
//   const [submitResult, setSubmitResult] = useState(null);
//   const [activeLeftTab, setActiveLeftTab] = useState('description');
//   const [activeRightTab, setActiveRightTab] = useState('code');
//   const editorRef = useRef(null);
//   let {problemId}  = useParams();

  

//   const { handleSubmit } = useForm();

//  useEffect(() => {
//     const fetchProblem = async () => {
//       setLoading(true);
//       try {
        
//         const response = await axiosClient.get(`/problem/problemById/${problemId}`);
       
        
//         const initialCode = response.data.startCode.find(sc => sc.language === langMap[selectedLanguage]).initialCode;

//         setProblem(response.data);
        
//         setCode(initialCode);
//         setLoading(false);
        
//       } catch (error) {
//         console.error('Error fetching problem:', error);
//         setLoading(false);
//       }
//     };

//     fetchProblem();
//   }, [problemId]);

//   // Update code when language changes
//   useEffect(() => {
//     if (problem) {
//       const initialCode = problem.startCode.find(sc => sc.language === langMap[selectedLanguage]).initialCode;
//       setCode(initialCode);
//     }
//   }, [selectedLanguage, problem]);

//   const handleEditorChange = (value) => {
//     setCode(value || '');
//   };

//   const handleEditorDidMount = (editor) => {
//     editorRef.current = editor;
//   };

//   const handleLanguageChange = (language) => {
//     setSelectedLanguage(language);
//   };

//   const handleRun = async () => {
//     setLoading(true);
//     setRunResult(null);
    
//     try {
//       const response = await axiosClient.post(`/submission/run/${problemId}`, {
//         code,
//         language: selectedLanguage
//       });

//       setRunResult(response.data);
//       setLoading(false);
//       setActiveRightTab('testcase');
      
//     } catch (error) {
//       console.error('Error running code:', error);
//       setRunResult({
//         success: false,
//         error: 'Internal server error'
//       });
//       setLoading(false);
//       setActiveRightTab('testcase');
//     }
//   };

//   const handleSubmitCode = async () => {
//     setLoading(true);
//     setSubmitResult(null);
    
//     try {
//         const response = await axiosClient.post(`/submission/submit/${problemId}`, {
//         code:code,
//         language: selectedLanguage
//       });

//        setSubmitResult(response.data);
//        setLoading(false);
//        setActiveRightTab('result');
      
//     } catch (error) {
//       console.error('Error submitting code:', error);
//       setSubmitResult(null);
//       setLoading(false);
//       setActiveRightTab('result');
//     }
//   };

//   const getLanguageForMonaco = (lang) => {
//     switch (lang) {
//       case 'javascript': return 'javascript';
//       case 'java': return 'java';
//       case 'cpp': return 'cpp';
//       default: return 'javascript';
//     }
//   };

//   const getDifficultyColor = (difficulty) => {
//     switch (difficulty) {
//       case 'easy': return 'text-green-500';
//       case 'medium': return 'text-yellow-500';
//       case 'hard': return 'text-red-500';
//       default: return 'text-gray-500';
//     }
//   };

//   if (loading && !problem) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <span className="loading loading-spinner loading-lg"></span>
//       </div>
//     );
//   }

//   return (
//     <div className="h-screen flex bg-base-100">
//       {/* Left Panel */}
//       <div className="w-1/2 flex flex-col border-r border-base-300">
//         {/* Left Tabs */}
//         <div className="tabs tabs-bordered bg-base-200 px-4">
//           <button 
//             className={`tab ${activeLeftTab === 'description' ? 'tab-active' : ''}`}
//             onClick={() => setActiveLeftTab('description')}
//           >
//             Description
//           </button>
//           <button 
//             className={`tab ${activeLeftTab === 'editorial' ? 'tab-active' : ''}`}
//             onClick={() => setActiveLeftTab('editorial')}
//           >
//             Editorial
//           </button>
//           <button 
//             className={`tab ${activeLeftTab === 'solutions' ? 'tab-active' : ''}`}
//             onClick={() => setActiveLeftTab('solutions')}
//           >
//             Solutions
//           </button>
//           <button 
//             className={`tab ${activeLeftTab === 'submissions' ? 'tab-active' : ''}`}
//             onClick={() => setActiveLeftTab('submissions')}
//           >
//             Submissions
//           </button>

//           <button 
//             className={`tab ${activeLeftTab === 'chatAI' ? 'tab-active' : ''}`}
//             onClick={() => setActiveLeftTab('chatAI')}
//           >
//             ChatAI
//           </button>


//         </div>

//         {/* Left Content */}
//         <div className="flex-1 overflow-y-auto p-6">
//           {problem && (
//             <>
//               {activeLeftTab === 'description' && (
//                 <div>
//                   <div className="flex items-center gap-4 mb-6">
//                     <h1 className="text-2xl font-bold">{problem.title}</h1>
//                     <div className={`badge badge-outline ${getDifficultyColor(problem.difficulty)}`}>
//                       {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
//                     </div>
//                     <div className="badge badge-primary">{problem.tags}</div>
//                   </div>

//                   <div className="prose max-w-none">
//                     <div className="whitespace-pre-wrap text-sm leading-relaxed">
//                       {problem.description}
//                     </div>
//                   </div>

//                   <div className="mt-8">
//                     <h3 className="text-lg font-semibold mb-4">Examples:</h3>
//                     <div className="space-y-4">
//                       {problem.visibleTestCases.map((example, index) => (
//                         <div key={index} className="bg-base-200 p-4 rounded-lg">
//                           <h4 className="font-semibold mb-2">Example {index + 1}:</h4>
//                           <div className="space-y-2 text-sm font-mono">
//                             <div><strong>Input:</strong> {example.input}</div>
//                             <div><strong>Output:</strong> {example.output}</div>
//                             <div><strong>Explanation:</strong> {example.explanation}</div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {activeLeftTab === 'editorial' && (
//                 <div className="prose max-w-none">
//                   <h2 className="text-xl font-bold mb-4">Editorial</h2>
//                   <div className="whitespace-pre-wrap text-sm leading-relaxed">
//                     <Editorial secureUrl={problem.secureUrl} thumbnailUrl={problem.thumbnailUrl} duration={problem.duration}/>
//                   </div>
//                 </div>
//               )}

//               {activeLeftTab === 'solutions' && (
//                 <div>
//                   <h2 className="text-xl font-bold mb-4">Solutions</h2>
//                   <div className="space-y-6">
//                     {problem.referenceSolution?.map((solution, index) => (
//                       <div key={index} className="border border-base-300 rounded-lg">
//                         <div className="bg-base-200 px-4 py-2 rounded-t-lg">
//                           <h3 className="font-semibold">{problem?.title} - {solution?.language}</h3>
//                         </div>
//                         <div className="p-4">
//                           <pre className="bg-base-300 p-4 rounded text-sm overflow-x-auto">
//                             <code>{solution?.completeCode}</code>
//                           </pre>
//                         </div>
//                       </div>
//                     )) || <p className="text-gray-500">Solutions will be available after you solve the problem.</p>}
//                   </div>
//                 </div>
//               )}

//               {activeLeftTab === 'submissions' && (
//                 <div>
//                   <h2 className="text-xl font-bold mb-4">My Submissions</h2>
//                   <div className="text-gray-500">
//                     <SubmissionHistory problemId={problemId} />
//                   </div>
//                 </div>
//               )}

//               {activeLeftTab === 'chatAI' && (
//                 <div className="prose max-w-none">
//                   <h2 className="text-xl font-bold mb-4">CHAT with AI</h2>
//                   <div className="whitespace-pre-wrap text-sm leading-relaxed">
//                     <ChatAi problem={problem}></ChatAi>
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </div>

//       {/* Right Panel */}
//       <div className="w-1/2 flex flex-col">
//         {/* Right Tabs */}
//         <div className="tabs tabs-bordered bg-base-200 px-4">
//           <button 
//             className={`tab ${activeRightTab === 'code' ? 'tab-active' : ''}`}
//             onClick={() => setActiveRightTab('code')}
//           >
//             Code
//           </button>
//           <button 
//             className={`tab ${activeRightTab === 'testcase' ? 'tab-active' : ''}`}
//             onClick={() => setActiveRightTab('testcase')}
//           >
//             Testcase
//           </button>
//           <button 
//             className={`tab ${activeRightTab === 'result' ? 'tab-active' : ''}`}
//             onClick={() => setActiveRightTab('result')}
//           >
//             Result
//           </button>
//         </div>

//         {/* Right Content */}
//         <div className="flex-1 flex flex-col">
//           {activeRightTab === 'code' && (
//             <div className="flex-1 flex flex-col">
//               {/* Language Selector */}
//               <div className="flex justify-between items-center p-4 border-b border-base-300">
//                 <div className="flex gap-2">
//                   {['javascript', 'java', 'cpp'].map((lang) => (
//                     <button
//                       key={lang}
//                       className={`btn btn-sm ${selectedLanguage === lang ? 'btn-primary' : 'btn-ghost'}`}
//                       onClick={() => handleLanguageChange(lang)}
//                     >
//                       {lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JavaScript' : 'Java'}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               {/* Monaco Editor */}
//               <div className="flex-1">
//                 <Editor
//                   height="100%"
//                   language={getLanguageForMonaco(selectedLanguage)}
//                   value={code}
//                   onChange={handleEditorChange}
//                   onMount={handleEditorDidMount}
//                   theme="vs-dark"
//                   options={{
//                     fontSize: 14,
//                     minimap: { enabled: false },
//                     scrollBeyondLastLine: false,
//                     automaticLayout: true,
//                     tabSize: 2,
//                     insertSpaces: true,
//                     wordWrap: 'on',
//                     lineNumbers: 'on',
//                     glyphMargin: false,
//                     folding: true,
//                     lineDecorationsWidth: 10,
//                     lineNumbersMinChars: 3,
//                     renderLineHighlight: 'line',
//                     selectOnLineNumbers: true,
//                     roundedSelection: false,
//                     readOnly: false,
//                     cursorStyle: 'line',
//                     mouseWheelZoom: true,
//                   }}
//                 />
//               </div>

//               {/* Action Buttons */}
//               <div className="p-4 border-t border-base-300 flex justify-between">
//                 <div className="flex gap-2">
//                   <button 
//                     className="btn btn-ghost btn-sm"
//                     onClick={() => setActiveRightTab('testcase')}
//                   >
//                     Console
//                   </button>
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     className={`btn btn-outline btn-sm ${loading ? 'loading' : ''}`}
//                     onClick={handleRun}
//                     disabled={loading}
//                   >
//                     Run
//                   </button>
//                   <button
//                     className={`btn btn-primary btn-sm ${loading ? 'loading' : ''}`}
//                     onClick={handleSubmitCode}
//                     disabled={loading}
//                   >
//                     Submit
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {activeRightTab === 'testcase' && (
//             <div className="flex-1 p-4 overflow-y-auto">
//               <h3 className="font-semibold mb-4">Test Results</h3>
//               {runResult ? (
//                 <div className={`alert ${runResult.success ? 'alert-success' : 'alert-error'} mb-4`}>
//                   <div>
//                     {runResult.success ? (
//                       <div>
//                         <h4 className="font-bold">✅ All test cases passed!</h4>
//                         <p className="text-sm mt-2">Runtime: {runResult.runtime+" sec"}</p>
//                         <p className="text-sm">Memory: {runResult.memory+" KB"}</p>
                        
//                         <div className="mt-4 space-y-2">
//                           {runResult.testCases.map((tc, i) => (
//                             <div key={i} className="bg-base-100 p-3 rounded text-xs">
//                               <div className="font-mono">
//                                 <div><strong>Input:</strong> {tc.stdin}</div>
//                                 <div><strong>Expected:</strong> {tc.expected_output}</div>
//                                 <div><strong>Output:</strong> {tc.stdout}</div>
//                                 <div className={'text-green-600'}>
//                                   {'✓ Passed'}
//                                 </div>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     ) : (
//                       <div>
//                         <h4 className="font-bold">❌ Error</h4>
//                         <div className="mt-4 space-y-2">
//                           {runResult.testCases.map((tc, i) => (
//                             <div key={i} className="bg-base-100 p-3 rounded text-xs">
//                               <div className="font-mono">
//                                 <div><strong>Input:</strong> {tc.stdin}</div>
//                                 <div><strong>Expected:</strong> {tc.expected_output}</div>
//                                 <div><strong>Output:</strong> {tc.stdout}</div>
//                                 <div className={tc.status_id==3 ? 'text-green-600' : 'text-red-600'}>
//                                   {tc.status_id==3 ? '✓ Passed' : '✗ Failed'}
//                                 </div>
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ) : (
//                 <div className="text-gray-500">
//                   Click "Run" to test your code with the example test cases.
//                 </div>
//               )}
//             </div>
//           )}

//           {activeRightTab === 'result' && (
//             <div className="flex-1 p-4 overflow-y-auto">
//               <h3 className="font-semibold mb-4">Submission Result</h3>
//               {submitResult ? (
//                 <div className={`alert ${submitResult.accepted ? 'alert-success' : 'alert-error'}`}>
//                   <div>
//                     {submitResult.accepted ? (
//                       <div>
//                         <h4 className="font-bold text-lg">🎉 Accepted</h4>
//                         <div className="mt-4 space-y-2">
//                           <p>Test Cases Passed: {submitResult.passedTestCases}/{submitResult.totalTestCases}</p>
//                           <p>Runtime: {submitResult.runtime + " sec"}</p>
//                           <p>Memory: {submitResult.memory + "KB"} </p>
//                         </div>
//                       </div>
//                     ) : (
//                       <div>
//                         <h4 className="font-bold text-lg">❌ {submitResult.error}</h4>
//                         <div className="mt-4 space-y-2">
//                           <p>Test Cases Passed: {submitResult.passedTestCases}/{submitResult.totalTestCases}</p>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ) : (
//                 <div className="text-gray-500">
//                   Click "Submit" to submit your solution for evaluation.
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProblemPage;



import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Editor from '@monaco-editor/react';
import { useParams, useLocation } from 'react-router';
import axiosClient from "../utils/axiosClient";
import SubmissionHistory from "../components/SubmissionHistory";
// import ChatAi from '../components/ChatAi';
import Navbar from './Header';

const langMap = {
  cpp: 'C++',
  java: 'Java',
  javascript: 'JavaScript'
};

const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);

  const [isRunning, setIsRunning] = useState(false);   // ✅ new
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ new

  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeRightTab, setActiveRightTab] = useState('code');

  const location = useLocation();
  const problemNumber = location.state?.problemNumber;

  const editorRef = useRef(null);
  let { problemId } = useParams();
  const { handleSubmit } = useForm();

  // FETCH PROBLEM
  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(`/problem/problemById/${problemId}`);

        const initialCode = response.data.startCode.find(
          sc => sc.language === langMap[selectedLanguage]
        )?.initialCode || '';

        setProblem(response.data);
        setCode(initialCode);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };
    fetchProblem();
  }, [problemId]);

  // CHANGE LANGUAGE
  useEffect(() => {
    if (problem) {
      const initialCode = problem.startCode.find(
        sc => sc.language === langMap[selectedLanguage]
      )?.initialCode || '';
      setCode(initialCode);
    }
  }, [selectedLanguage, problem]);

  // RUN CODE
  const handleRun = async () => {
    if (isRunning) return;

    setIsRunning(true);
    setRunResult(null);

    try {
      const res = await axiosClient.post(`/submission/run/${problemId}`, {
        code,
        language: selectedLanguage
      });

      console.log("RUN RESULT:", res.data); // ✅ debug

      setRunResult(res.data);
      setActiveRightTab('testresult');
    } catch (err) {
      console.error(err);
      setRunResult({ success: false });
    }

    setIsRunning(false);
  };

  // SUBMIT CODE
  const handleSubmitCode = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const res = await axiosClient.post(`/submission/submit/${problemId}`, {
        code,
        language: selectedLanguage
      });

      console.log("SUBMIT RESULT:", res.data);

      setSubmitResult(res.data);
      setActiveRightTab('result');
    } catch (err) {
      console.error(err);
    }

    setIsSubmitting(false);
  };

  const getDifficultyColor = (difficulty) => {
    switch ((difficulty || "").toLowerCase()) {
      case 'easy': return 'bg-green-500/20 text-green-400 border border-green-500';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500';
      case 'hard': return 'bg-red-500/20 text-red-400 border border-red-500';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (loading && !problem) {
    return <div className="h-screen flex justify-center items-center text-white">Loading...</div>;
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white">

      {/* HEADER */}
      <Navbar />

      <div className="flex flex-1">

        {/* LEFT PANEL */}
        {/* <div className="w-1/2 flex flex-col bg-gray-900 border-r border-gray-700">

          <div className="flex gap-3 p-3 bg-gray-800 border-b border-gray-700">
            {['description', 'editorial', 'solutions', 'submissions', 'chatAI'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveLeftTab(tab)}
                className={`px-3 py-1 rounded ${
                  activeLeftTab === tab
                    ? 'bg-blue-600'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-5 overflow-y-auto flex-1">
            {problem && activeLeftTab === 'description' && (
              <>
                <div className="flex items-center gap-4 mb-5">
                  <h1 className="text-xl font-bold">
                    {problemNumber}. {problem.title}
                  </h1>
                  <span className={`px-2 py-1 text-sm rounded ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                </div>

                <p className="text-gray-300 whitespace-pre-wrap">
                  {problem.description}
                </p>

                <div className="mt-6 space-y-4">
                  {problem.visibleTestCases?.map((ex, i) => (
                    <div key={i} className="bg-gray-800 p-4 rounded border border-gray-700">
                      <p><b>Input:</b> {ex.input}</p>
                      <p><b>Output:</b> {ex.output}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeLeftTab === 'submissions' && <SubmissionHistory problemId={problemId} />}
            {activeLeftTab === 'chatAI' && <ChatAi problem={problem} />}
              
                {activeLeftTab === 'editorial' && (
                <div className="prose max-w-none">
                  <h2 className="text-xl font-bold mb-4">Editorial</h2>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {'Editorial is here for the problem'}
                  </div>
                </div>
              )}

              {activeLeftTab === 'solutions' && (
                <div>
                  <h2 className="text-xl font-bold mb-4">Solutions</h2>
                  <div className="space-y-6">
                    {problem.referenceSolution?.map((solution, index) => (
                      <div key={index} className="border border-base-300 rounded-lg">
                        <div className="bg-base-200 px-4 py-2 rounded-t-lg">
                          <h3 className="font-semibold">{problem?.title} - {solution?.language}</h3>
                        </div>
                        <div className="p-4">
                          <pre className="bg-base-300 p-4 rounded text-sm overflow-x-auto">
                            <code>{solution?.completeCode}</code>
                          </pre>
                        </div>
                      </div>
                    )) || <p className="text-gray-500">Solutions will be available after you solve the problem.</p>}
                  </div>
                </div>
              )}
              
          </div>
        </div> */}
        {/* LEFT PANEL */}
<div className="w-1/2 flex flex-col bg-gray-900 border-r border-gray-700">

  {/* Tabs */}
  <div className="flex gap-3 p-3 bg-gray-800 border-b border-gray-700">
    {['description', 'editorial', 'solutions', 'submissions', ].map(tab => (
      <button
        key={tab}
        onClick={() => setActiveLeftTab(tab)}
        className={`px-3 py-1 rounded ${
          activeLeftTab === tab
            ? 'bg-blue-600 text-white'
            : 'text-gray-300 hover:bg-gray-700'
        }`}
      >
        {tab}
      </button>
    ))}
  </div>

  {/* Content */}
  <div className="p-5 overflow-y-auto flex-1">

    {/* DESCRIPTION */}
    {problem && activeLeftTab === 'description' && (
      <>
        <div className="flex items-center gap-4 mb-5">
          <h1 className="text-xl font-bold">
            {problemNumber}. {problem.title}
          </h1>
          <span className={`px-2 py-1 text-sm rounded ${getDifficultyColor(problem.difficulty)}`}>
            {problem.difficulty}
          </span>
        </div>

        <p className="text-gray-300 whitespace-pre-wrap">
          {problem.description}
        </p>

        <div className="mt-6 space-y-4">
          {problem.visibleTestCases?.map((ex, i) => (
            <div key={i} className="bg-gray-800 p-4 rounded border border-gray-700">
              <p><b>Input:</b> {ex.input}</p>
              <p><b>Output:</b> {ex.output}</p>
            </div>
          ))}
        </div>
      </>
    )}

    {/* EDITORIAL */}
    {/* {activeLeftTab === 'editorial' && (
      <div>
        <h2 className="text-xl font-bold mb-4">Editorial</h2>
        <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-300">
          {problem?.editorial || 'Editorial will be available soon.'}
        </div>
      </div>
    )} */}
{activeLeftTab === 'editorial' && (
  <div className="space-y-4">

    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold text-white">📘 Editorial</h2>
    </div>

    <div className="bg-gray-800 border border-gray-700 rounded-lg p-5 shadow-inner">
      <p className="text-gray-300 whitespace-pre-wrap leading-relaxed text-sm">
        {problem?.editorial || 'Editorial will be available soon.'}
      </p>
    </div>

    {/* Optional Tip Box */}
    <div className="bg-indigo-900/30 border border-indigo-500 p-4 rounded-lg">
      <p className="text-indigo-300 text-sm">
        💡 Tip: Try solving the problem yourself before reading the editorial.
      </p>
    </div>

  </div>
)}
    {/* SOLUTIONS */}
    {/* {activeLeftTab === 'solutions' && (
      <div>
        <h2 className="text-xl font-bold mb-4">Solutions</h2>

        {problem?.referenceSolution?.length > 0 ? (
          <div className="space-y-6">
            {problem.referenceSolution.map((solution, index) => (
              <div key={index} className="border border-gray-700 rounded-lg">
                <div className="bg-gray-800 px-4 py-2 rounded-t-lg">
                  <h3 className="font-semibold">
                    {problem?.title} - {solution?.language}
                  </h3>
                </div>

                <div className="p-4">
                  <pre className="bg-gray-900 p-4 rounded text-sm overflow-x-auto">
                    <code>{solution?.completeCode}</code>
                  </pre>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">
            Solutions will be available after you solve the problem.
          </p>
        )}
      </div>
    )} */}
    {activeLeftTab === 'solutions' && (
  <div className="space-y-6">

    <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold text-white">💻 Solutions</h2>
    </div>

    {problem?.referenceSolution?.length > 0 ? (
      <div className="space-y-6">

        {problem.referenceSolution.map((solution, index) => (
          <div
            key={index}
            className="border border-gray-700 rounded-xl overflow-hidden shadow-lg"
          >

            {/* Header */}
            <div className="bg-gray-800 px-4 py-2 flex justify-between items-center">
              <h3 className="font-semibold text-green-400">
                {solution?.language}
              </h3>

              {/* Copy Button */}
              <button
                onClick={() => navigator.clipboard.writeText(solution?.completeCode)}
                className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
              >
                Copy
              </button>
            </div>

            {/* Code */}
            <div className="bg-black p-4 text-sm overflow-x-auto">
              <pre className="text-white-300">
                <code>{solution?.completeCode}</code>
              </pre>
            </div>

          </div>
        ))}

      </div>
    ) : (
      <div className="bg-yellow-900/30 border border-yellow-500 p-4 rounded-lg">
        <p className="text-yellow-300">
          🚧 Solutions will be available after you solve the problem.
        </p>
      </div>
    )}

  </div>
)}

    {/* SUBMISSIONS */}
    {activeLeftTab === 'submissions' && (
      <SubmissionHistory problemId={problemId} />
    )}

    {/* CHAT AI
    {activeLeftTab === 'chatAI' && (
      <ChatAi problem={problem} />
    )} */}

  </div>
</div>

        {/* RIGHT PANEL */}
        <div className="w-1/2 flex flex-col">

          <div className="flex gap-3 p-3 bg-gray-800 border-b border-gray-700">
            {['code', 'testcase', 'testresult', 'result'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveRightTab(tab)}
                className={`px-3 py-1 rounded ${
                  activeRightTab === tab
                    ? 'bg-gray-500'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* CODE */}
          {activeRightTab === 'code' && (
            <div className="flex flex-col flex-1">

              <div className="p-3 flex gap-2 border-b border-gray-700">
                {['javascript', 'java', 'cpp'].map(lang => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-3 py-1 rounded ${
                      selectedLanguage === lang
                        ? 'bg-purple-600'
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              <Editor
                height="100%"
                language={selectedLanguage}
                value={code}
                onChange={(v) => setCode(v || '')}
                theme="vs-dark"
              />

              <div className="p-3 flex justify-end gap-3 border-t border-gray-700">
                <button
                  onClick={handleRun}
                  disabled={isRunning}
                  className={`px-4 py-1 rounded ${
                    isRunning ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500'
                  }`}
                >
                  {isRunning ? "Running..." : "Run"}
                </button>

                <button
                  onClick={handleSubmitCode}
                  disabled={isSubmitting}
                  className={`px-4 py-1 rounded ${
                    isSubmitting ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          )}

          {/* TESTCASES */}
          {activeRightTab === 'testcase' && (
            <div className="p-4 overflow-y-auto">
              <h2 className="text-lg font-semibold mb-4">Example Testcases</h2>

              {problem?.visibleTestCases?.length > 0 ? (
                problem.visibleTestCases.map((tc, i) => (
                  <div key={i} className="bg-gray-800 p-4 mb-3 rounded border border-gray-700">
                    <p><b>Input:</b> {tc.input}</p>
                    <p><b>Expected:</b> {tc.output}</p>
                  </div>
                ))
              ) : (
                <p>No testcases available</p>
              )}
            </div>
          )}

          {/* TEST RESULT */}
         
          {activeRightTab === 'testresult' && (
  <div className="p-4 overflow-y-auto">

    {runResult?.testCases ? (
      runResult.testCases.map((tc, i) => {
        const expected = problem?.visibleTestCases?.[i]?.output || "N/A";
        const isCorrect = tc.stdout?.trim() === expected?.trim();

        return (
          <div
            key={i}
            className={`p-4 mb-3 rounded border ${
              isCorrect
                ? 'bg-green-900/30 border-green-600'
                : 'bg-red-900/30 border-red-600'
            }`}
          >
            <p><b>Input:</b> {tc.stdin}</p>
            <p><b>Expected:</b> {expected}</p>
            <p><b>Your Output:</b> {tc.stdout}</p>

            {/* ✅ RESULT BADGE */}
            <p className={`mt-2 font-semibold ${
              isCorrect ? 'text-green-400' : 'text-red-400'
            }`}>
              {isCorrect ? "✔ Correct" : "✖ Wrong"}
            </p>
          </div>
        );
      })
    ) : (
      <p>{runResult?.output || runResult?.stdout || "No Output"}</p>
    )}

  </div>
)}


          {/* RESULT */}
          {activeRightTab === 'result' && (
            <div className="p-4">
              {submitResult && (
                <div className={`p-4 rounded ${
                  submitResult.accepted
                    ? 'bg-green-900/30 border border-green-600'
                    : 'bg-red-900/30 border border-red-600'
                }`}>
                  {submitResult.accepted ? "Accepted 🎉" : "Failed ❌"}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProblemPage;

