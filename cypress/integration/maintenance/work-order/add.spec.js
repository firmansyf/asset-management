/* eslint-disable cypress/no-unnecessary-waiting */
import moment from 'moment'
beforeEach(cy.login)

describe('Add Maintenance Work Order', () => {
  beforeEach(() => {
    cy.visit('maintenance/work-orders/add')
    cy.intercept('**/api/**').as('api')
  })

  afterEach(() => cy.wait(8000))

  it('Add Maintenance Work Order ( Check Notif Mandatory )', () => {
    cy.wait('@api')
    cy.wait(3000)
    cy.get('button[type="submit"]').click({ force: true })

    cy.wait(2000)
    cy.contains('Title is required').should('exist')
    cy.contains('Description is required').should('exist')
    cy.contains('Please Choose Start Date').should('exist')
    cy.contains('Please Choose End Date').should('exist')
    cy.contains('Please Choose Due Date').should('exist')
    cy.contains('Duration in minute').should('exist')
    cy.contains('Please fill in mandatory field(s) to continue.').should('exist')
  })

  // it('Add Maintenance Work Order ( Check Add Maintenance Category )', () => {
  //   cy.wait('@api')

  //   cy.wait(3000)
  //   cy.get(':nth-child(12) > .input-group > [data-cy=add-input-btn]').click({ force: true })
  //   cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

  //   cy.get('input[name="category"]').type('Main Category ' + moment().format('mmss'), { force: true })
  //   cy.get('.modal-footer > .btn-primary').click({ force: true })
  // })

  // it('Add Maintenance Work Order ( Check  Maintenance Status )', () => {
  //   cy.wait('@api')

  //   cy.wait(5000)
  //   cy.contains('Maintenance Status').should('not.exist')
  // })  

  it('Check Upload File', () => {
    cy.wait('@api')
    cy.wait(3000)
    cy.fixture('images/profile.png').then(fileContent => {
      cy.get('input[type=file]').attachFile({
        fileContent: fileContent.toString(),
        fileName: 'images/profile.png',
        encoding: 'utf-8',
        mimeType: 'image/png'
      })
    })
  })

  it('Add Maintenance Work Order ( Estimate Duration ( Minute ) )', () => {
    cy.wait('@api')
    cy.wait(3000)
    if( !cy.contains('Enter Estimate Duration').should('not.exist') ) {
      cy.contains('Enter Estimate Duration').should('exist')
    }
  }) 

  it('[MAINTENANCE] Standardize Work Order', () => {
    cy.wait('@api')
    cy.wait(3000)

    cy.contains('Work Order Title').should('exist')
    cy.contains('Work Order Description').should('exist')
    cy.contains('Estimate Duration (Minutes)').should('exist')
    cy.contains('Asset by Location').should('exist')
  })
})
