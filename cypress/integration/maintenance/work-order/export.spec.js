/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(cy.login)

describe('Export Maintenance Work Order', () => {
  beforeEach(() => {
    cy.visit('maintenance/work-order')
    cy.intercept('**/api/**').as('api')
  })

  it('Export Maintenace Work Order', () => {
    cy.wait(6000)
    cy.get('[data-cy=table]').should('exist')
    cy.get('#dropdown-basic').click({force: true})
    cy.get('[data-cy=exportToPDF]').click({force: true})
    cy.get('[role=dialog]').should('have.class', 'fade modal show')
    cy.wait(2000)
    cy.get('button[type="submit"]').click({force: true})
  })

  it('Filter Export Maintenace Work Order', () => {
    cy.wait(6000)
    cy.get('[data-cy=table]').should('exist')
    cy.get('[data-cy=filterAll]').click({force : true})
    cy.get('input[type=checkbox]#column-4').check({force : true})
    cy.wait(2000)
    cy.get('[data-cy=filterChild]').should('exist')
    cy.get('[data-cy=filterChild]').click({force : true})
    cy.get('input[type=checkbox]#priority-0').check({force : true})
    cy.wait(2000)
    cy.get('#dropdown-basic').click({force: true})
    cy.get('[data-cy=exportToPDF]').click({force: true})
    cy.get('[role=dialog]').should('have.class', 'fade modal show')
    cy.wait(2000)
    cy.get('button[type="submit"]').click({force: true})
  })
})