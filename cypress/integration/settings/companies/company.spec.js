beforeEach(cy.login)

describe('Case By Tickets', () => {
  beforeEach( () => {
    cy.visit('setup/settings/companies')
    cy.intercept('GET', '**/setting/company*').as('getCompany')
  })

  it('FE-2314 Deleted company still shown in company dropdown list', () => {
    let name = 'Test Profile Company 001'
    cy.get('[data-cy="addCompany"]').click({force: true})
    cy.get('.modal').invoke('show')
    cy.get('input[name="name"]').type(name, {force: true})
    cy.get('input[name="address_1"]').type('Address 1', {force: true})
    cy.get('input[name="street"]').type('Address 2', {force: true})
    cy.get('input[name="city"]').type('City', {force: true})
    cy.get('input[name="state"]').type('State', {force: true})
    cy.get('input[name="postcode"]').type('12345', {force: true})
    cy.get('select[name="country_code"]').select('Argentina')
    cy.get('button[type="submit"]').contains('Add').click({force: true})
    cy.wait('@getCompany')
    cy.get('#kt_filter_search').type(name)
    cy.wait(2000)
    cy.get('[data-cy="deleteTable"]').click({force: true})
    cy.get('.modal').invoke('show')
    cy.get('.modal.show').find('button[type="submit"]').contains('Delete').click({force: true})
    cy.wait('@getCompany')
    cy.visit('profile')
    cy.get('#company_guid_cy').type('{downarrow}', {force: true}).closest('[class$=-container]').find('[id*=-option-]').should('not.contain', name)
  })
})
