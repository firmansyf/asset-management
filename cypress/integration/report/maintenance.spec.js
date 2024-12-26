beforeEach(cy.login)
describe('Report Maintenance, Testing...', () => {
  beforeEach(() => {
    cy.visit('reports/maintenance')
    cy.intercept('GET', '**/report/**').as('api')
  })

  it('Fetch Report Maintenance', () => {
    cy.wait('@api')
    cy.wait(3000)
    cy.contains('Maintenance').should('exist')
  })

  // it('Fetch Report Maintenance', () => {
  //   cy.intercept('GET', '/report/**', { statusCode: 200 })
  //   cy.intercept('GET', '/media/**', { delayMs: 4000 }).as('fetchMedia')
  //   cy.get('#kt_content').find('.card-body')
  //   cy.get('.table-responsive table')
  //     .find('thead > tr > th')
  //     .should('have.length', 6)
  // })

  // it('Search', () => {
  //   cy.get('input[data-test=search]').should('have.attr', 'placeholder', 'Search')
  //     .click()
  //     .type('yusuf')
  //   cy.intercept('GET', `${Cypress.env('api')}report/**`, { fixture: './reports/reports.json' })
  // })

  // it('Test Button Actions', () => {
  //   cy.get('.dropdown').find('button[type="button"]').should('have.class', 'dropdown-toggle').click({ force: true })
  // })

  // it('Test Button Actions Export To PDF', () => {
  //   cy.get('.dropdown').find('button[type="button"]')
  //     .should('have.class', 'dropdown-toggle')
  //     .click({ force: true })
  //   cy.get('div').should('have.class', 'show')
  //     .find('a')
  //     .contains('Export to PDF')
  //     .click({ force: true })
  //   cy.get('[role=document]').should('have.class', 'modal-dialog')
  //     .find('.modal-content')
  //   cy.get('button[type="submit"]').click()

  // })

  // it('Test Button Actions Export To Excel', () => {
  //   cy.get('.dropdown').find('button[type="button"]')
  //     .should('have.class', 'dropdown-toggle')
  //     .click({ force: true })
  //   cy.get('div').should('have.class', 'show')
  //     .find('a')
  //     .contains('Export to Excel')
  //     .click({ force: true })
  //   cy.get('[role=document]').should('have.class', 'modal-dialog')
  //     .find('.modal-content')
  //   cy.get('button[type="submit"]').click()

  // })

  // it('Test Button Actions Automated Report', () => {
  //   cy.get('.dropdown').find('button[type="button"]')
  //     .should('have.class', 'dropdown-toggle')
  //     .click({ force: true })
  //   cy.get('div').should('have.class', 'show')
  //     .find('a.dropdown-item')
  //     .contains('Automated Report')
  //     .click({ force: true })
  //   cy.get('form').within(() => {
  //     cy.get('.modal-header').find('div').should('have.class', 'modal-title').contains('Add Automated Report')
  //     cy.get('.modal-body').within(() => {
  //       cy.get('.report-name').find('input[name*="name"]').should('have.value', 'Maintenance')
  //       cy.get('.report-team').find('select[name*="team_guid"]').select('testing (1)')
  //       cy.get('.report-frequency').within(() => {
  //         cy.get('input[name*="frequency_value"]').click({ multiple: true })
  //       })
  //     })
  //     cy.get('.modal-footer').find('button[type=submit]').contains('Add').click()
  //   })

  // })

  // it('Test Number for Data', () => {
  //   cy.get('select[name*="number_of_page"]').select('25')
  // })

  // it('Test Pagination', () => {
  //   cy.get('ul.pagination > li').find('i.previous').click()
  //   cy.get('ul.pagination > li').find('i.next').click()
  // })
})