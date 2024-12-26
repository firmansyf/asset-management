beforeEach(cy.login)

describe('Custome Report, Testing...', () => {
    beforeEach( () => { 
        cy.visit('reports/custom-report')
      })

    it('Fetch Custom Report Page', () => {
        cy.get('.page-title > .d-flex > div').should('contain', 'Custom Reports')
        cy.get('.fs-6 > :nth-child(1) > .d-flex > .me-1').should('contain', 'Asset ID')
        cy.get(':nth-child(2) > .d-flex > .me-1').should('contain', 'Asset Description')
        cy.get(':nth-child(3) > .d-flex > .me-1').should('contain', 'Assigned User')
        cy.get(':nth-child(4) > .d-flex > .me-1').should('contain', 'Asset Location')
        cy.get(':nth-child(5) > .d-flex > .me-1').should('contain', 'Asset Name')
    })

    it('Serach', () => {
        cy.get('input#kt_filter_search')
        .should('have.attr', 'placeholder', 'Search')
        .click({force: true})
        .type('ABC00001{enter}', {force: true})
        cy.get('tbody > tr').then((data) => {
            if (data.length > 0) {  
              cy.get('tbody > tr > td').should('contain', 'ABC00001')
            }
        })
    })

    it('Test Button Actions', () => {
        cy.get('button#dropdown-basic').should('have.class', 'dropdown-toggle').click({force: true})
        cy.get('[data-cy=customReportSaveAs]').should('contain', 'Save As')
    })

    it('Test Create New Report', () => {
        cy.get('button#dropdown-basic').should('have.class', 'dropdown-toggle').click({force: true})
        cy.get('[data-cy=customReportSaveAs]').should('contain', 'Save As').click({force: true})
        cy.get('.modal-title').should('contain', 'Save Custom Report')
        cy.get('.col-form-label').should('contain', 'Report Name')
        cy.get('input[name*="name"]').type('New Report', {force: true})
        cy.get('[data-cy=saveButtonCR]').should('contain', 'Save').click({force: true})
    })

    it('Test Setup Columns', () => {
        cy.get('[data-cy="setupColumns"]').should('contain', 'Setup Columns').click({force: true})
        cy.get('.modal-title > .card-label').should('contain', 'Select Table Columns')
        cy.get('.modal-title > .fs-7').should('contain', 'Select the fields you want to show in the table columns')
        cy.get('#column-9').click({force: true})
        cy.get('.card-title > .card-label').should('contain', 'Order Table Columns')
        cy.get('.text-muted').should('contain', 'Drag and drop the columns to rearrange the columns order')
        cy.get('.modal-footer > .btn-primary').should('contain', 'Save').click({force: true})
    })    

    it('Test Pagination', () => {
        // cy.get('ul.pagination > li').find('i.previous').click()
        // cy.get('ul.pagination > li').find('i.next').click()
    })
})
