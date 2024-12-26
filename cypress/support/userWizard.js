const {server, tenant, email, password, storageKey, passwordEncrypt} = Cypress.env()

export default function userLogin() {
  const encrypt_1 = window.btoa(password+passwordEncrypt[0])
  const encrypt_2 = window.btoa(encrypt_1+passwordEncrypt[1])
  cy.session([email, encrypt_2], () => {
    cy.request({
      method: 'POST',
      url: `https://${tenant}.be.${server}/api/v1/a/hash-login`,
      body: {
        email,
        password: encrypt_2,
        expire: 4000,
        type: 'automatic'
      }
    }).then(({ body }) => {
      const persist = {
        accessToken: `\"${body.token}\"`,
      }
      window.localStorage.setItem(storageKey, JSON.stringify(persist))
    })
  })
  cy.intercept('**/a/me', (req) => {
    req.continue((res) => {
      const {body, body :{data}} = res
      res.send({...res, body: {...body, data: {...data, registration_wizard_status: 1}}})
    })
  }).as('userWizard')
}
