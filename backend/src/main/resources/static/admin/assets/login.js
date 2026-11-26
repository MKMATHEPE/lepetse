(async()=>{
  const form=document.getElementById('login-form'),message=document.getElementById('login-message');
  const params=new URLSearchParams(location.search);
  if(params.has('error'))message.textContent='Unable to sign in. Check your username and password.';
  if(params.has('limited'))message.textContent='Too many sign-in attempts. Please try again in 15 minutes.';
  if(params.has('logout'))message.textContent='You have signed out.';
  try{
    const response=await fetch('/api/admin/session',{cache:'no-store'});
    if(!response.ok)throw Error();
    const session=await response.json();
    if(session.authenticated){location.replace('/admin/index.html');return;}
    const token=document.createElement('input');token.type='hidden';token.name=session.csrfParameter;token.value=session.csrfToken;form.append(token);
    document.getElementById('sign-in').disabled=false;
  }catch{message.textContent='Sign-in is temporarily unavailable. Refresh to try again.';}
})();
