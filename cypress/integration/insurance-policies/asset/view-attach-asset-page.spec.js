beforeEach(cy.login)

describe('[ Insurance Policies ] Testing View Asset', () => {
  beforeEach(() => {
    cy.visit('insurance/policies')
    cy.intercept('GET', '**/insurance/filter*').as('fetchInsurances')
    cy.wait('@fetchInsurances')
  })

  it('fetch insurances', () => {
    cy.get('@fetchInsurances').its('response.statusCode').should('eq', 200)
  })
  it('Asset Tab', () => {
    cy.get('.table-responsive table').within(() => {
        cy.get('[data-cy=editTable]:first').click({force: true})
    })
    cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
    cy.get('[data-rb-event-key="assets"]').click({force: true})
  })
  it('BUG-142 [INSURANCE POLICY] attach asset tab', () => {
    cy.get('[data-cy="addInsurancePolicy"]').click({force: true})
    cy.get('.modal').invoke('show').should('have.class', 'show')
    cy.get('[data-rb-event-key="tab-assets"]').click({force: true})
    cy.get('button').contains('Attach Exisiting Asset').click({force: true})
    cy.get('.table tbody tr').should('have.length.greaterThan', 0)
  })
})
