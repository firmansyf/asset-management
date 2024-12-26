/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(cy.login)

describe('Maintenance Detail', () => {
  beforeEach(() => {
    cy.visit('maintenance/work-orders/detail/ab020078-cb62-4725-aef1-60f3753d7879')
    cy.intercept('**/api/**').as('api')
  })


  it('Check Maintenance Content Detail', () => {
    cy.wait(3000)
  })

  it('Check Maintenance Edit Button', () => {
    cy.wait(3000)
    cy.get('.fa-pencil-alt.text-warning').should('be.visible');
  })

  it('Check Maintenance Delete Button', () => {
    cy.wait(3000)
    cy.get('.fa-trash-alt.text-danger').should('be.visible');
  })

  it('Check Maintenance Archive Button', () => {
    cy.wait(3000)
    cy.get('.fa-file-archive').should('be.visible');
  })

  it('Check Maintenance Bookmark Button', () => {
    cy.wait(3000)
    cy.get('.fa-star').should('be.visible');
  })

  it('Check Maintenance Process Log', () => {
    cy.wait(3000)
    cy.get('.btn-primary').should('contain', "Process Log");
  })
})