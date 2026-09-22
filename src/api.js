let csrfToken='';
export async function api(path, body, options={}) {
 const form=body instanceof FormData;
 const response=await fetch(`/api/${path}.php`, {credentials:'same-origin', ...options, method:body?'POST':'GET',headers:{...(body&&!form?{'Content-Type':'application/json'}:{}),...(body?{'X-CSRF-Token':csrfToken}:{})},body:body?(form?body:JSON.stringify(body)):undefined});
 let data;try{data=await response.json();}catch{throw new Error('The PHP API is unavailable. Check the backend configuration.');}
 if(!response.ok){const error=new Error(data.error||'Something went wrong.');error.status=response.status;window.dispatchEvent(new CustomEvent('api-error',{detail:error}));throw error;}
 if(data.csrf)csrfToken=data.csrf;return data;
}
// Query parameters belong after .php, not before it.
export async function list(resource, admin=false) {
 const response=await fetch(`/api/${resource}/list.php${admin?'?admin=1':''}`,{credentials:'same-origin'});
 let data;try{data=await response.json();}catch{throw new Error('Unable to connect to the PHP API.');}
 if(!response.ok){const e=new Error(data.error||'Unable to load records.');e.status=response.status;window.dispatchEvent(new CustomEvent('api-error',{detail:e}));throw e;}return data;
}
export async function getProject(slug){const r=await fetch(`/api/projects/get.php?slug=${encodeURIComponent(slug)}`);let d;try{d=await r.json();}catch{throw new Error('Unable to connect to the PHP API.');}if(!r.ok){const e=new Error(d.error||'Project not found.');e.status=r.status;throw e;}return d;}
