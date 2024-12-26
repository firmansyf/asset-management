describe('Case by Tickets', () => {
    beforeEach(() => {
        cy.intercept('**/api/**').as('getAsset')
        cy.intercept('**/asset/**').as('getAssetDetail')
    })

    it('FE-2222 | Existing value for brand not showing on edit', () => {
        cy.visit('asset-management/edit?id=4530f504-0224-4acf-bb65-1c1b8aac6fc5')
        cy.wait('@getAsset')
        cy.contains('Brand').should('exist')
        cy.get('#select-brand').should('exist')
        // cy.get('#select-brand').select('bfe629cb-1469-47e8-bb34-c08c8b04ddb4')
    })

    it('BUG-130 | Assignee fields in Edit Asset appear to be empty', () => {
        cy.visit('asset-management/all')
        cy.wait('@getAsset')
        cy.get('[data-cy="editTable"]:first').click({force: true})
        cy.wait('@getAssetDetail')
        cy.get('#select-category').parent().prev().should('exist')
    })

    it('FE-2262 Remove description text', () => {
        cy.visit('asset-management/add')
        cy.intercept('**/api/**').as('api')
        cy.wait('@api')
        cy.get('[data-cy="upload-container"]').first().contains('Drag a file here').should('have.length.lessThan', 2)
    })

    it('FE-2232 Font size in asset files', () => {
        cy.visit('asset-management/add')
        cy.intercept('**/api/**').as('api')
        cy.wait('@api')
        cy.get('[data-cy="upload-container"]:first').contains(/drag a file/gi).should('not.have.class', /fs-/gi)
    })

    it('FE-2204 Custom fields and financial info improvement', () => {
        cy.visit('asset-management/add')
        cy.intercept('**/api/**').as('api')
        cy.wait('@api')
        cy.get('[data-cy="financial-info"]').closest('.accordion').should('have.class', 'accordion-fit-content')
    })

    it('[BUG-96] add asset issue', () => {
        cy.visit('asset-management/add')
        cy.intercept('**/setting/department/filter*').as('getDepartment')
        cy.wait('@getDepartment').its('response.statusCode').should('eq', 200)
    })

    it('[BUG-139] issue on dropdown and currency', () => {
        cy.visit('asset-management/add')
        cy.get('select[name^="custom_field"]:first').should('not.have.value')
    })
})