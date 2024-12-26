export default function hasPermission(perm) {
  cy.intercept('**/a/me', (req) => {
    req.continue((res) => {
      const {data} = res.body
      let {permissions} = data
      permissions = permissions.find(({name}) => name === perm)
      res.send({...res, body: {data, permissions}})
    })
  }).as('permission')
  cy.wait('@permission').its('response.body.permissions').should('exist')
}
