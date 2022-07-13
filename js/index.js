import {fetch, handleIncomingRedirect, getDefaultSession, login} from '@inrupt/solid-client-authn-browser';
import {getMostRecentWebID, getPersonName, getRDFasJson, setMostRecentWebID} from "./utils";

let storageLocationUrl;
let clientIdEnabled = false;
let promoterCache = {};

window.onload = async () => {
  let solidFetch = fetch;

  document.getElementById('log-in-btn').addEventListener('click', () => {
    clickLogInBtn(solidFetch)
  });

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  storageLocationUrl = urlParams.get('location') || 'https://pheyvaer.pod.knows.idlab.ugent.be/examples/master-thesis-students/1-public';
  clientIdEnabled = urlParams.get('enable_client_id') === 'true';

  document.getElementById('storage-location').value = storageLocationUrl;

  const webIDInput = document.getElementById('webid');
  webIDInput.value = getMostRecentWebID();
  webIDInput.addEventListener("keyup", ({key}) => {
    if (key === "Enter") {
      clickLogInBtn(solidFetch);
    }
  })

  loginAndFetch(null, solidFetch);
};

async function loginAndFetch(oidcIssuer, solidFetch) {
  // 1. Call the handleIncomingRedirect() function to complete the authentication process.
  //   If the page is being loaded after the redirect from the Solid Identity Provider
  //      (i.e., part of the authentication flow), the user's credentials are stored in-memory, and
  //      the login process is complete. That is, a session is logged in
  //      only after it handles the incoming redirect from the Solid Identity Provider.
  //   If the page is not being loaded after a redirect from the Solid Identity Provider,
  //      nothing happens.
  await handleIncomingRedirect();

  // 2. Start the Login Process if not already logged in.
  if (!getDefaultSession().info.isLoggedIn) {
    if (oidcIssuer) {
      document.getElementById('current-user').classList.add('hidden');
      document.getElementById('webid-form').classList.remove('hidden');
      let loginOptions = {oidcIssuer};

      if (clientIdEnabled) {
        loginOptions.clientId = 'https://solid-plato.netlify.app/id'
      } else {
        loginOptions.redirectUrl = window.location.href
      }

      await login(loginOptions);
    }
  } else {
    const webid = getDefaultSession().info.webId;

    const frame = {
      "@context": {
        "@vocab": "http://xmlns.com/foaf/0.1/",
        "knows": "https://data.knows.idlab.ugent.be/person/office/#",
        "schema": "http://schema.org/",
      },
      "@id": webid
    };

    const result = await getRDFasJson(webid, frame, fetch);
    const name = getPersonName(result) || webid;

    document.getElementById('current-user').innerText = 'Welcome ' + name;
    document.getElementById('current-user').classList.remove('hidden');
    // document.getElementById('storage-location-container').classList.remove('hidden');
    document.getElementById('status-message').classList.remove('hidden');
    document.getElementById('webid-form').classList.add('hidden');
    await loadTable(solidFetch);
    document.getElementById('status-message').innerText = 'All data is loaded.'
  }
}

async function clickLogInBtn(solidFetch) {
  // Hide no OIDC issuer error
  // document.getElementById('no-oidc-issuer-error').classList.add('hidden');

  // Get web id
  const webId = document.getElementById('webid').value;
  setMostRecentWebID(webId);

  // Get issuer
  const frame = {
    "@context": {
      "@vocab": "http://xmlns.com/foaf/0.1/",
      "knows": "https://data.knows.idlab.ugent.be/person/office/#",
      "schema": "http://schema.org/",
      "solid": "http://www.w3.org/ns/solid/terms#",
      "solid:oidcIssuer": {"@type": "@id"}
    },
    "@id": webId
  };

  const result = await getRDFasJson(webId, frame, fetch);
  const oidcIssuer = result['solid:oidcIssuer'];

  if (Array.isArray(oidcIssuer)) {
    // Ask user to select desired OIDC issuer.
    //showOIDCIssuerForm(oidcIssuer);
    throw new Error('Not implemented yet.');
  }

  // Login and fetch
  if (oidcIssuer) {
    loginAndFetch(oidcIssuer, solidFetch);
  } else {
    document.getElementById('no-oidc-issuer-error').classList.remove('hidden');
  }
}

async function loadTable(solidFetch) {
  return new Promise(async resolve => {
    const frame = {
      "@context": {
        "@vocab": "http://schema.org/",
        "knows": "https://data.knows.idlab.ugent.be/person/office/#",
        "knows:promoter": {"@type": "@id"},
      },
      "@type": "Thesis"
    };

    const result = await getRDFasJson(storageLocationUrl, frame, solidFetch);
    console.log(result);

    const $table = document.createElement('table');
    const $thead = document.createElement('thead');
    const $tbody = document.createElement('tbody');
    $thead.innerHTML= `<tr><th>Master thesis</th><th>Student</th><th>Promoters</th><th>Degree</th></tr>`;
    $table.appendChild($thead);
    $table.appendChild($tbody);
    document.getElementById('table-container').innerHTML = '';
    document.getElementById('table-container').appendChild($table);

    let thesisAdded = 0;

    result['@graph'].forEach(async thesis => {
      await addThesisToTable($tbody, thesis);
      thesisAdded ++;

      if (thesisAdded === result['@graph'].length) {
        resolve();
      }
    })
  });
}

async function addThesisToTable($tbody, thesis) {
  const row = document.createElement('tr');

  const titleColumn = document.createElement('td');
  titleColumn.innerText = thesis.name;
  row.appendChild(titleColumn);

  const authorColumn = document.createElement('td');
  authorColumn.innerText = thesis.author.name;
  row.appendChild(authorColumn);

  const promotersColumn = document.createElement('td');
  let promoters = thesis['knows:promoter'];

  if (!Array.isArray(promoters)) {
    promoters = [promoters];
  }

  const promoterNames = [];
  for (const promoter of promoters) {
    promoterNames.push(await getPromoterName(promoter));
  }

  promotersColumn.innerText = promoterNames.join(', ');
  row.appendChild(promotersColumn);

  const degreeColumn = document.createElement('td');
  degreeColumn.innerText = thesis.inSupportOf;
  row.appendChild(degreeColumn);

  $tbody.appendChild(row);
}

async function getPromoterName(webid) {
  if (!promoterCache[webid]) {
    const frame = {
      "@context": {
        "@vocab": "http://xmlns.com/foaf/0.1/",
        "knows": "https://data.knows.idlab.ugent.be/person/office/#",
        "schema": "http://schema.org/",
      },
      "@id": webid
    };

    try {
      const result = await getRDFasJson(webid, frame, fetch);
      promoterCache[webid] = getPersonName(result) || webid;
    } catch (e) {
      promoterCache[webid] = webid;
    }
  }

  return promoterCache[webid];
}
