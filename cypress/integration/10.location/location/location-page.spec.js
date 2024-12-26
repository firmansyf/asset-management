beforeEach(() => {
    cy.login('testingaccount@mailinator.com', 'Test@123')
})

describe('[Location] Testing Location Page', () => {
    beforeEach( () => {
        cy.visit('location/location')
        cy.intercept(
        {
            method: 'GET',
            url: '**/location/filter*',
        },
        { fixture: './location/location-list.json' }
        ).as('fetchLocations')
        cy.wait('@fetchLocations').its('response.statusCode').should('eq', 200)
        cy.get('.table-responsive table').as('LocationTable')
    })

    it('Check Location Table (Fetch Data)', () => {
        cy.get('@LocationTable').find('tbody > tr').should('have.length.greaterThan', 0)
        cy.get('@LocationTable').find('[data-cy=editTable]:first').should('be.visible')
        cy.get('@LocationTable').find('[data-cy=deleteTable]:first').should('be.visible')
    })

    it('Search Data Location (Keyword : Jaya)', () => {
        cy.get('input[data-cy=locationSearch]').type('jaya', {force: true})
        cy.intercept('GET', '**/location/filter*', {fixture: './location/location-search.json'}).as('fetchLocationSearch')
        cy.wait('@fetchLocationSearch').its('response.statusCode').should('eq', 200)
        cy.get('.table-responsive table.table-row-dashed.table-row-gray-300.gy-3').as('LocationTableSearch')
        cy.get('@LocationTableSearch').within(() => {
            cy.get('tbody').find('tr.align-middle').should('contain', 'Jaya')
        })
        cy.get('input[data-cy=locationSearch]').clear()
    })

    it('Check Filter Button', () => {
        cy.get('.dropdown').find('button').contains('Filter').click({force: true})
        cy.get('label').should('contain', "Location Name").and('be.visible')
    })

    it('Check Add Button', () => {
        cy.get('button[data-cy=addLocation]').should('contain', "Add New Location").and('be.visible')
    })

    it('Check Actions Button', () => {
        cy.get('.dropdown').find('button').contains('Actions').click({force: true})
        cy.get('.dropdown-item').should('contain', "Export to PDF").and('be.visible')
    })

    it('Try Export to PDF', () => {
        cy.get('[data-cy=actions] button').click({force: true})
        cy.get('.dropdown > .show.dropdown').find('[data-cy=exportToPDF]').click({force: true})
        cy.get('[role="dialog"]').should('be.visible')
        cy.get('button > span.indicator-label').contains('Download').click({force: true})
    })

    it('Check Location Sorting By Location Name', () => {
        cy.get('[data-cy=sort]').find('.d-flex').contains('Location Name').click({force: true})
        cy.get('span > svg> g')
        cy.get('[id="Stockholm-icons-/-Navigation-/-Angle-down"]').then(($sorting) => {
        if ($sorting) {
            cy.intercept('GET', '**/location/filter*', {fixture: './location/location-name-desc.json'})
            cy.get('.table-responsive table.table-row-dashed.table-row-gray-300.gy-3').as('LocationTableSorting')
            cy.get('@LocationTableSorting').find('tbody > tr').should('have.length', 10)
            cy.get('@LocationTableSorting').find('tbody > tr.align-middle').first().find('td').contains("Tenggarong")
        }})
    })

    it('Change Number Data Per Page', () => {
        cy.get('select[name="number_of_page"]').select('25', {force: true})
        cy.intercept('GET', '**/location/filter*', {fixture: './location/location-page2.json'})
        cy.get('@LocationTable').find('tbody > tr').then(($row) => {
            if ($row > 10) {
                cy.get('@LocationTable').find('thead > tr > th').should('contain', "Location Name").and('be.visible')
            }
        })
    })

    it('Pagination Test go to Page 2', () => {
        cy.get('.page-link').contains("2").click({force: true})
            cy.intercept({
            method: 'GET',
            url: '**/location/filter?page=2&limit=10&orderDir=asc&orderCol=name'
        })
        cy.get('@LocationTable').find('thead > tr > th').should('contain', "Location Name").and('be.visible')
    })

})

describe('Case By Tickets', () => {
  beforeEach( () => {
    cy.visit('location/location')
    cy.intercept('GET', '**/location/filter*').as('getLocation')
  })
  it('SEN-139 Cannot read properties of null (reading value)', () => {
    cy.wait('@getLocation').its('response.statusCode').should('eq', 200)
  })
})
