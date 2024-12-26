/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(cy.login)

describe('Aside Menu', () => {
  beforeEach(() => {
    cy.visit('dashboard')
  })

  it('Check Aside Menu', () => {
    cy.intercept('**/api/v1/widget*').as('getWidget')
    cy.get('[style="display: block;"] > :nth-child(1) > .menu-link > .menu-title').should('contain', 'Dashboard')
    cy.get('[style="display: block;"] > :nth-child(2) > .menu-link > .menu-title').should('contain', 'My Assets')
    cy.get('[style="display: block;"] > :nth-child(3) > .menu-link > .menu-title').should('contain', 'Asset Management')
  })

  it('Check Aside Menu > Asset Management > All', () => {
    cy.visit('asset-management/all')
    cy.reload(true)
    cy.get('.here > span.menu-link > .menu-title').should('contain', 'Asset Management')
    cy.get('.here > .menu-sub > :nth-child(1) > .menu-link > .menu-title').should('contain', 'All')
  })
})
