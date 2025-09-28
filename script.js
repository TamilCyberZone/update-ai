document.addEventListener("DOMContentLoaded", () => {
  const chatMessages = document.getElementById("chat-messages");
  const userInput = document.getElementById("user-input");
  const sendButton = document.getElementById("send-button");
  const answerEl = document.getElementById("answer");
  const sourcesEl = document.getElementById("sources");

  const knowledgeBase = {
    "toy car": { text:"ஒரு சிறிய டாய் கார் பிளாஸ்டிக் பாட்டில் அல்லது கார்ட்போர்டு உடையால் செய்யலாம்.", link:"https://www.wikihow.com/Make-a-Toy-Car" },
    "javascript": { text:"JavaScript என்பது வலைப்பக்கங்களை இயங்கக்கூடியதாக 만드는 programming மொழி.", link:"https://developer.mozilla.org/en-US/docs/Web/JavaScript" }
  };

  const codeTemplates = {
    "javascript":"// JavaScript example\nconsole.log('Hello World');",
    "python":"# Python example\nprint('Hello World')"
  };

  function addMessage(msg, isUser=false){
    const div = document.createElement('div');
    div.classList.add('message', isUser?'user-message':'bot-message');
    const p = document.createElement('p'); p.innerHTML = msg;
    div.appendChild(p);
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function getLocalResponse(input){
    const key = input.toLowerCase();
    for(const k in knowledgeBase){
      if(key.includes(k)) return knowledgeBase[k].text + (knowledgeBase[k].link?('<br><a class="link" href="'+knowledgeBase[k].link+'" target="_blank">Link</a>'):'');
    }
    return null;
  }

  function detectCode(input){
    const langs = Object.keys(codeTemplates);
    const wantsCode = /\b(write|make|code|function|class|app|program)\b/.test(input.toLowerCase());
    const lang = langs.find(l=>input.toLowerCase().includes(l));
    return wantsCode?lang:null;
  }

  async function fetchWikipedia(q){
    try{
      const r = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(q)}`);
      if(!r.ok) return null;
      const j = await r.json();
      return j.extract?{source:'Wikipedia', text:j.extract, link:j.content_urls?.desktop?.page||null}:null;
    }catch(e){return null;}
  }

  async function fetchDuckDuckGo(q){
    try{
      const r = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json&no_redirect=1&skip_disambig=1`);
      if(!r.ok) return null;
      const j = await r.json();
      if(j.AbstractText) return {source:'DuckDuckGo', text:j.AbstractText, link:j.AbstractURL||null};
      return null;
    }catch(e){return null;}
  }

  async function gatherWebSources(q){
    const results = await Promise.all([fetchWikipedia(q), fetchDuckDuckGo(q)]);
    return results.filter(Boolean);
  }

  function synthesize(snippets){
    let combined='';
    snippets.forEach(s=>{
      combined += s.text + (s.link?('<br><a class="link" href="'+s.link+'" target="_blank">Link</a>'):'') + '<br><br>';
    });
    return combined;
  }

  async function handleInput(){
    const input = userInput.value.trim();
    if(!input) return;
    addMessage(input,true);
    userInput.value='';

    let localResp = getLocalResponse(input);
    if(localResp){
      addMessage(localResp);
      answerEl.innerHTML = localResp;
      sourcesEl.innerHTML = "<b>Source:</b> Local Knowledge";
      return;
    }

    const codeLang = detectCode(input);
    if(codeLang && codeTemplates[codeLang]){
      const code = codeTemplates[codeLang];
      addMessage('Code ('+codeLang+'):<br><pre class="code">'+code+'</pre>');
      answerEl.innerHTML = '<pre class="code">'+code+'</pre>';
      sourcesEl.innerHTML = "<b>Source:</b> Local Template";
      return;
    }

    addMessage("Searching web sources...");
    answerEl.textContent = "Working...";
    const webSnippets = await gatherWebSources(input);
    if(webSnippets.length===0){
      addMessage("No web data found.");
      answerEl.textContent = "No web data found or CORS blocked.";
      sourcesEl.innerHTML='';
      return;
    }

    const finalAnswer = synthesize(webSnippets);
    addMessage(finalAnswer);
    answerEl.innerHTML = finalAnswer;
    sourcesEl.innerHTML = "<b>Sources:</b> "+webSnippets.map(s=>s.source).join(', ');
  }

  sendButton.addEventListener('click', handleInput);
  userInput.addEventListener('keypress', e=>{ if(e.key==='Enter') handleInput(); });
});
