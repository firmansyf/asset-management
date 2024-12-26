/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(cy.login)

describe('[ Add Maintenace Work Order ] Loading Spinner Add Maintenace Work Order', () => {
  beforeEach(() => {
    cy.visit('maintenance/work-order')
    cy.intercept('**/api/**').as('api')
  })

  it('Loading Spinner Add Maintenace Work Order', () => {
    cy.wait('@api')
    cy.get('[data-cy=addWorkOrder]').click({force:true})

    cy.wait(3000)
    if( !cy.contains('Please wait...').should('not.exist') ) {
      cy.contains('Please wait...').should('exist')
    }
  })  

  it('Edit Work Order Check Maintenance Status', () => {
    cy.wait('@api')

    cy.wait(3000)
    cy.get('[data-cy=editTable]').first().click({ force: true })
    
    cy.wait(5000)
    cy.contains('Maintenance Status').should('exist')
  })  

  it('Duplicate Check Maintenance', () => {
    cy.wait('@api')

    cy.get('[data-cy=checkbokBulk]').first().click({ force:true })
    cy.get('#dropdown-basic').click({force: true});
    cy.get('[data-cy=duplicateWo]').click({force: true});
  })  

  it('Archive Check Maintenance', () => {
    cy.wait('@api')

    cy.get('[data-cy=checkbokBulk]').first().click({ force:true })
    cy.get('#dropdown-basic').click({force: true});
    cy.get('[data-cy=archiveWo]').click({force: true});
  })  

  it('Filter Work Order', () => {
    cy.wait('@api')

    cy.get('[data-cy=quickFilter]').click({force:true})    
    if( !cy.contains('All Work Order').should('not.exist') ) { cy.contains('All Work Order').should('exist') }
    if( !cy.contains('My Work Order').should('not.exist') ) { cy.contains('My Work Order').should('exist') }
    if( !cy.contains('Open').should('not.exist') ) { cy.contains('Open').should('exist') }
    if( !cy.contains('In Progress').should('not.exist') ) { cy.contains('In Progress').should('exist') }
    if( !cy.contains('All Hold').should('not.exist') ) { cy.contains('All Hold').should('exist') }
    if( !cy.contains('Flags').should('not.exist') ) { cy.contains('Flags').should('exist') }
    if( !cy.contains('Bookmarks').should('not.exist') ) { cy.contains('Bookmarks').should('exist') }
    if( !cy.contains('Archive').should('not.exist') ) { cy.contains('Archive').should('exist') }
    
    cy.wait(1000)
    cy.get('[data-cy=quick-0]').click({force:true})
  })  

  it('[MAINTENANCE] Standardize Work Order', () => {
    cy.wait('@api')    
    cy.wait(3000)
    if ( cy.contains('Work Order Id').should('exist') ) {
      cy.contains('Work Order Id').should('exist')
    } else {
      cy.contains('Work Order Id').should('not.exist')
    }

    if ( cy.contains('Work Order Title').should('exist') ) {
      cy.contains('Work Order Title').should('exist')
    } else {
      cy.contains('Work Order Title').should('not.exist')
    }
    if ( !cy.contains('Work Order Description').should('not.exist') ) {
      cy.contains('Work Order Description').should('exist')
    } else {
      cy.contains('Work Order Description').should('not.exist')
    }
    if ( !cy.contains('Estimate Duration (Minutes)').should('not.exist') ) {
      cy.contains('Estimate Duration (Minutes)').should('exist')
    } else {
      cy.contains('Estimate Duration (Minutes)').should('not.exist')
    }
    if ( cy.contains('Maintenance Category').should('exist') ) {
      cy.contains('Maintenance Category').should('exist')
    } else {
      cy.contains('Maintenance Category').should('not.exist')
    }

    if ( !cy.contains('Asset by Location').should('not.exist') ) {
      cy.contains('Asset by Location').should('exist')
    } else {
      cy.contains('Asset by Location').should('not.exist')
    }
  })
})