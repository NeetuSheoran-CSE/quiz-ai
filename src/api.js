

export async function callClaude(data) {
  const res = await fetch( "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent" ,
   'X-goog-api-key: AIzaSyBwf7iaCmM1TwxKdXUl4_dM0hUmculUg98' ,
    { 
      method : "POST" ,
  headers: {
    'Content-Type': 'application/json',
    // 'X-goog-api-key': 'AIzaSyBwf7iaCmM1TwxKdXUl4_dM0hUmculUg98'
  },
  body: JSON.stringify(
     {
        "parts": [
          {
            "text": "Explain how AI works in a few words"
          }
        ]
      })
    }
  );

  return await res.json();
}

  
  // }' ", {
    
    
    
    
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify(data),
  // });

//   return await res.json();
// }

