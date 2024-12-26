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
}
// export default function userLogin(email, password) {
//   cy.session([email, password], () => {
//       cy.visit('/auth/login')
//       cy.get('[name*="email"]').type(email)
//       cy.get('[name*="password"]').type(password)
//       cy.get('.btn').click()
//       cy.intercept('POST', `${Cypress.env('api')}a/hash-login`).as('login')
//       cy.intercept('GET',`${Cypress.env('api')}a/me`).as('user')
//
//       cy.url().should('contain', '/dashboard')
//   })
// }
