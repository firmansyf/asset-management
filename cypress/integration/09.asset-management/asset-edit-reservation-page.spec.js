/* eslint-disable cypress/no-unnecessary-waiting */
import moment from 'moment';
beforeEach(cy.login)

describe('[ Asset Management ] Add Reservation Page', () => {
  it('Add Reservation Page', () => {
    cy.visit('asset-management/detail/cf39d30f-0c6e-49f5-82e5-7077b62abb90')
    cy.intercept('GET', '**/api/**').as('fetchAsset')
    cy.wait('@fetchAsset')

    cy.contains('Reservation Schedule').should('exist')
    cy.get('.btn-reserved').should('contain', 'Reserve')
    cy.get('[data-cy=btnAddReserve]').click({force: true})
    cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
    cy.get('form').within( () => {
      cy.get('input[name="start_date"]').type(moment().format('DD/MM/YYYY'), {force: true})
      cy.get('input[name="end_date"]').type(moment().add('3 days').format('DD/MM/YYYY'), {force: true})
      cy.get('#select-reserve-for').type('{downarrow}', {force: true}).tab()
      cy.get('textarea[name="description"]').type('Asset 1', {force: true})
      cy.get('input[name="send_email"]').check({force: true})
      cy.get('.modal-footer > .btn-primary').click({force: true})
    //   cy.intercept(
    //     'PUT',
    //     Cypress.env('api') + 'asset-reservation/d7cd545e-d94f-480a-828f-86de8d791c5a'
    //   ).as('ediResrevedAsset')
    })
  })

  it.only('Edit Reservation Page', () => {
      cy.visit('asset-management/detail/cf39d30f-0c6e-49f5-82e5-7077b62abb90')
      cy.intercept('GET', '**/api/**').as('fetchAsset')
      cy.wait(3000)

      cy.contains('Reservation Schedule').should('exist')
      // cy.get('.btn-reserved').should('contain', 'Reserve')
      cy.get('[data-cy=btnEditReserve]').click({force: true})
      cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
      cy.get('form').within( () => {
        // cy.get('input[name="start_date"]').type(moment().format('DD/MM/YYYY'), {force: true})
        // cy.get('input[name="end_date"]').type(moment().add('3 days').format('DD/MM/YYYY'), {force: true})
        cy.get('#select-reserve-for').type('{downarrow}', {force: true}).tab()
        cy.get('textarea[name="description"]').type(`Asset 5 - ${moment().format('DDMMYYYYHHmmss')}`, {force: true})
        cy.get('input[name="send_email"]').check({force: true})
        cy.get('.modal-footer > .btn-primary').click({force: true})
      //   cy.intercept(
      //     'PUT',
      //     Cypress.env('api') + 'asset-reservation/d7cd545e-d94f-480a-828f-86de8d791c5a'
      //   ).as('ediResrevedAsset')
      })
  })

  it('Add Reservation Page ( Check Disable Date )', () => {
    cy.visit('asset-management/detail/cf39d30f-0c6e-49f5-82e5-7077b62abb90')
    cy.intercept('GET', '/media/**', { delayMs: 15000 }).as('fetchMedia')
    cy.intercept('GET', '**/asset/*').as('fetchAsset')
    cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])

    cy.get(':nth-child(5) > .card > .card-body > .small').click({ force: true })
    cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
    cy.get('form').within(() => {
      cy.get(':nth-child(2) > .rdt > .form-control').click({ force: true })
      cy.get(':nth-child(2) > .rdt > .rdtPicker > .rdtDays > table > tbody > :nth-child(2) > [data-value="11"]').click({ force: true })
      cy.get(':nth-child(3) > .rdt > .form-control').click({ force: true })
      cy.get(':nth-child(3) > .rdt > .rdtPicker > .rdtDays > table > tbody > :nth-child(2) > [data-value="8"]').click({ force: true })
    })
  })
})
