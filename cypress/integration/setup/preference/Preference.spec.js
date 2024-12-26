beforeEach(cy.login)

describe('FE-1237 (CLONE - [PREFERENCE] Inventory ID)', () => {
  it('Check Form Inventory ID', () => {
    cy.visit('setup/preference')
    cy.get('input[name=inventory_id_prefix]').should('exist')
  })
})

describe('Preference Page, Testing..', () => {
  beforeEach( () => {
      cy.visit('setup/preference')
  })

  it('Check Timezone', () => {
      cy.get('.timezone').find('label').should('contain', 'Timezone')
      cy.get('.timezone_cypress')
      .click({force:true})
      .find('input#timezoneCy')
      .type('Jakarta{enter}', {force: true})
  })
})
