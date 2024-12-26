beforeEach(cy.login)

describe('[ Contact ] Setup Columns Page', () => {
  it('Check Go to Setup Columns Page', () => {
    cy.visit('user-management/contact')
    // cy.intercept('GET', '/media/**', {delayMs: 15000}).as('fetchMedia')
    // cy.intercept('GET', '**/help-desk/contact*').as('fetchContact')
    // cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])

    cy.get('[data-cy=actions]').click({force: true})
    cy.get('.dropdown-menu > :nth-child(3)').click({force: true})
    cy.contains('Manage Columns').should('exist')
  })

  it('Check Save Setup Columns', () => {
    cy.visit('user-management/contact')
    // cy.intercept('GET', '/media/**', {delayMs: 15000}).as('fetchMedia')
    // cy.intercept('GET', '**/help-desk/contact*').as('fetchContact')
    // cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])

    cy.get('[data-cy=actions]').click({force: true})
    cy.get('.dropdown-menu > :nth-child(3)').click({force: true})
    cy.contains('Manage Columns').should('exist')
    cy.get('input#column-6').click({force: true})
    cy.get('.indicator-label').should('contain', 'Save Setup').click({force: true})
  })

  it('Check Cancel Setup Columns', () => {
    cy.visit('user-management/contact')
    // cy.intercept('GET', '/media/**', {delayMs: 15000}).as('fetchMedia')
    // cy.intercept('GET', '**/help-desk/contact*').as('fetchContact')
    // cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])

    cy.get('[data-cy=actions]').click({force: true})
    cy.get('.dropdown-menu > :nth-child(3)').click({force: true})
    cy.contains('Manage Columns').should('exist')
    cy.get('input#column-6').click({force: true})
    cy.get('.btn.btn-sm.btn-secondary.me-2').should('contain', 'Cancel').click({force: true})
  })
})