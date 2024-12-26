/* eslint-disable cypress/no-unnecessary-waiting */

beforeEach(cy.wizard)
const date=Date.now();

describe('Wizard Page', () => {
    beforeEach( () => {
        cy.visit('setup/wizard')
    })

    it('Check Wizard Page', () => {
        cy.title().should('contain', 'Wizard')
        cy.get('.col-11 > .d-flex > .m-0').should('contain', 'Setup Wizard')
        cy.get('.current > .stepper-label > .stepper-title').should('contain', 'Company')
        cy.get(':nth-child(2) > .stepper-label > .stepper-title').should('contain', 'Locations')
        cy.get(':nth-child(3) > .stepper-label > .stepper-title').should('contain', 'Sub Locations')
        cy.get(':nth-child(4) > .stepper-label > .stepper-title').should('contain', 'Categories')
        cy.get(':nth-child(5) > .stepper-label > .stepper-title').should('contain', 'Database')
        cy.get(':nth-child(6) > .stepper-label > .stepper-title').should('contain', 'Features')
        cy.get(':nth-child(7) > .stepper-label > .stepper-title').should('contain', 'Complete')
    })
})

describe('Skip Wizard Page', () => {
    beforeEach( () => {
        cy.visit('setup/wizard')
    })

    it('Check skip wizard', () => {
        cy.get('.btn-light-primary > .indicator-label').should('contain', 'Skip Wizard')

    })
})

describe('Wizard Step 1 - Company Info', () => {
    beforeEach( () => {
        cy.visit('setup/wizard')
    })

    it('Check Company Detail', () => {
        // cy.get('.current > :nth-child(1) > :nth-child(1) > .pb-lg-12 > .row > .fw-bolder > .svg-icon > .mh-50px').should('be.visible')
        cy.get('[data-cy=titleHeaderWizardStep1]').should('contain', 'Company details')
        cy.get('[data-cy=descHeaderWizardStep1]').should('contain', 'Provide the name and site of the main office.')

        // // Check field lable
        cy.get('[data-cy=labelCompany]').should('contain', 'Company')
        cy.get('[data-cy=labelCountry]').should('contain', 'Country')
        cy.get('[data-cy=labelExtendedAddress]').should('contain', 'Extended Address')
        cy.get('[data-cy=labelCity]').should('contain', 'City')
        cy.get('[data-cy=labelState]').should('contain', 'State/Province')
        cy.get('[data-cy=labelZip]').should('contain', 'ZIP/Postal Code')

        // // check error message if field is empty
        // cy.get('[data-cy=company]').clear({force: true}).blur({force: true})
        // cy.get('[data-cy=error_company]').should('contain', 'Company Name is a required field')
        // // cy.get('[data-cy=country]').type('{enter}', {force: true}).clear({force: true}).blur({force: true})
        // cy.get('[data-cy=error_country]').should('contain', 'Country is a required field')
        // cy.get('[data-cy=address]').clear({force: true}).blur({force: true})
        // cy.get('[data-cy=error_address]').should('contain', 'Address 1 is a required field')
        // cy.get('[data-cy=extended_address]').clear({force: true}).blur({force: true})
        // cy.get('[data-cy=error_extended_address]').should('contain', 'Address 2 is a required field')
        // cy.get('[data-cy=city_company]').clear({force: true}).blur({force: true})
        // cy.get('[data-cy=error_city_company]').should('contain', 'City is a required field')
        // cy.get('[data-cy=state]').clear({force: true}).blur({force: true})
        // cy.get('[data-cy=error_state]').should('contain', 'State is a required field')
        // cy.get('[data-cy=postal_code]').clear({force: true}).blur({force: true})
        // cy.get('[data-cy=error_postal_code]').should('contain', 'Postal Code is a required field')
    })

    it('Check Timezone & Currency', () => {
        cy.get('[data-cy=headerSectionTimezone]').should('contain', 'Timezone & Currency')
        cy.get('[data-cy=descSectionTimezone]').should('contain', 'Adjust the settings to fit your local timezone and currency to keep everything organized.')
        // Check field lable
        cy.get('[data-cy=labelTimezone]').should('contain', 'Timezone')
        cy.get('[data-cy=labelCurrency]').should('contain', 'Currency')
        cy.get('[data-cy=labelDateFormat]').should('contain', 'Date format')
        cy.get('[data-cy=labelTimeFormat]').should('contain', 'Time format')
        cy.get('[data-cy=labelFinancialYearBegin]').should('contain', 'Financial Year begins on')

        // check error message if field is empty
        // cy.get('select.form-select.form-select-solid[name*="currency"]').select('Select Currency', {force: true}).should('have.value', '').blur({force: true})
        // cy.get('div.fv-plugins-message-container.invalid-feedback').should('contain', 'Currency is a required field')
    })

    it('Check Company Logo', () => {
        // cy.get(':nth-child(3) > .py-5 > .fw-bolder > .svg-icon > .mh-50px').should('be.visible')
        cy.get(':nth-child(3) > .py-5 > .fw-bolder').should('contain', 'Company Logo')
        cy.get('div.text-black-400').should('contain', 'Upload your organization’s logo to make this space your own')
        // check error message if field is empty
        cy.get('.upload__image-wrapper > .d-flex').should('contain', 'your logo').click({force: true})
    })

    it('Continue Button to Next step', () => {
        cy.wait(10000)
        cy.get('button#0 > .indicator-label').should('contain', 'Continue').click({force: true})
        cy.get('.stepper-nav > .current').should('contain', 'Locations')
    })
})

describe('Wizard Step 2 - Location', () => {
    beforeEach( () => {
        cy.visit('setup/wizard')
        cy.intercept('**/api/**').as('fetchDataLocation')
        cy.wait('@fetchDataLocation')
        cy.wait(10000)
        cy.get('button#0 > .indicator-label').should('contain', 'Continue').click({force: true})
    })

    it('Check Wizard Location Table', () => {
        // check page title
        cy.title().should('contain', 'Wizard')

        // Check Header Title
        // cy.get('.current > .stepper-label > .stepper-title').should('contain', 'Locations')
        cy.get('[data-cy=titleHeaderStep2]').should('contain', 'List of Locations')
        cy.get('[data-cy=descHeader1LocationWizard]').should('contain', 'AssetData allows you to enter multiple locations. For example, the location may be a building or address.')
        cy.get('[data-cy=descHeader2LocationWizard]').should('contain', 'This means that you can better track each asset that is assigned to a given location.')

        // check table header
        // cy.get('.current > .w-100 > .table-responsive > [data-cy=table] > thead > .fs-6 > :nth-child(1)').should('contain', 'Location Name')
        cy.get('[data-cy=table]').find('thead > tr > th').should('contain', 'Location Status')
        cy.get('[data-cy=table]').find('thead > tr > th').should('contain', 'City')
        cy.get('[data-cy=table]').find('thead > tr > th').should('contain', 'State')
        cy.get('[data-cy=table]').find('thead > tr > th').should('contain', 'Country')
        cy.get('[data-cy=table]').find('thead > tr > th').should('contain', 'Zip/Postal Code')
        // cy.get('[data-cy=table]').find('[data-cy=editTable]:first').should('be.visible')
        // cy.get('[data-cy=table]').find('[data-cy=deleteTable]:first').should('be.visible')

        // Check Add button and modal
        cy.get('[data-cy=btn-add-location]').should('contain', 'Add New Location')
        cy.get('[data-cy=btn-add-location]').should('contain', 'Add New Location').click({force: true})
        // cy.get('div.modal').find('div.modal-header').should('contain', 'Add a Location')
        cy.get('[data-cy=cancelAddLocation]').should('contain', 'Cancel').click({force: true})

    })

    it('Check Add Location', () => {
        // check error message if location filed is empty
        cy.get('[data-cy=btn-add-location]').should('contain', 'Add New Location').click({force: true})
        cy.get('div.modal').find('div.modal-header').should('contain', 'Add a Location')
        cy.get('input[name*="name"]').clear({force: true}).blur({force: true})
        cy.get('div.fv-plugins-message-container.invalid-feedback').should('contain', 'Location is required.')
        cy.get('[data-cy=cancelAddLocation]').should('contain', 'Cancel').click({force: true})

        // check input new location
        cy.get('[data-cy=btn-add-location]').should('contain', 'Add New Location').click({force: true})
        cy.get('div.modal').find('div.modal-header').should('contain', 'Add a Location')
        cy.get('[data-cy=name]').type(`Indonesia ${date}`, {force: true})
        // cy.get('[data-cy=location_status]').select('78d1fd72-b85c-41d4-9fd1-2857dce92822', {force: true})
        cy.get('[data-cy=description]').type('Description', {force: true})
        cy.get('[data-cy=address1]').type('Gatot Subroto No.123', {force: true})
        cy.get('[data-cy=city1]').type('Bandung', {force: true})
        cy.get('[data-cy=state1]').type('West Java', {force: true})
        cy.get('[data-cy=postal_code1]').type('44567', {force: true})
        // cy.get('select.form-select.form-select-sm.form-select-solid[name="country"]').select('Indonesia')
        cy.get('[data-cy=submitModalAddLocation]').contains('Add').click({force: true})
        // cy.intercept('POST', '**/location/*').as('addWizardLocation')
        // cy.wait('@addWizardLocation').its('response.statusCode').should('be.oneOf', [200, 201, 422])
    })

    it('Check Edit Location', () => {
        // get location data contain 'Indonesia'
        cy.get('[data-cy=table]')
        // .find('tbody > tr.align-middle').filter(':contains("Indonesia")').first()
        .find('[data-cy=editTable]:first').click({force: true, multiple: true})
        // check modal
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
        cy.get('div.modal').find('div.modal-header').should('contain', 'Edit a Location')
        // edit data form
        cy.get('[data-cy=name]').clear({force: true}).type(`Indonesia Update ${date}`, {force: true})
        // cy.get('select.form-select.form-select-sm.form-select-solid[name*="location_status"]').select('Available')
        cy.get('[data-cy=description]').clear({force: true}).type('Description 123', {force: true})
        cy.get('[data-cy=address1]').clear({force: true}).type('Asia-Afrika 345', {force: true})
        cy.get('[data-cy=city1]').clear({force: true}).type('Kota Bandung', {force: true})
        cy.get('[data-cy=state1]').clear({force: true}).type('West Jawa', {force: true})
        cy.get('[data-cy=postal_code1]').clear({force: true}).type('44559', {force: true})
        // cy.get('select.form-select.form-select-sm.form-select-solid[name="country"]').select('Malaysia')
        cy.get('[data-cy=submitModalAddLocation]').contains('Save').click({force: true})
        // cy.intercept('PUT', '**location/*').as('editWizardLocation')
        //cy.wait('@editWizardLocation').its('response.statusCode').should('be.oneOf', [200, 201, 422])
    })

    it('Check Delete Location', () => {
        cy.get('[data-cy=table]')
          .find('tbody > tr.align-middle').filter(':contains("Indonesia")').first()
          .find('[data-cy=deleteTable]:first').click({force: true})
        cy.get('[role=dialog]').should('have.class', 'fade modal show')
        cy.get('button[type*="submit"] > .indicator-label').contains('Delete').click({force: true})
        // cy.intercept('DELETE','**/location/*').as('deleteLocation')
    })

    it('Check Button Back To Step 1', () => {
        // cy.get('.mr-2 > .btn').should('contain', 'Back').click({force: true})
        // cy.get('.stepper-nav > .current').should('contain', 'Company')
    })

    it('Check Button To Next Step (Step 3)', () => {
        cy.get('.stepper-nav > .current').should('contain', 'Locations')
        cy.get('button#2 > .indicator-label').should('contain', 'Continue').click({force: true})
        cy.get('.stepper-nav > .current').should('contain', 'Sub Locations')
    })
})

describe('Wizard Step 3 - Sub Location', () => {
    beforeEach( () => {
        cy.visit('setup/wizard')
        cy.intercept('GET', '**/location/filter*').as('fetchLocation')
        cy.intercept('GET', '**/location-sub/filter?*').as('fetchSubLocation')
        cy.intercept('POST', '**/location-sub').as('addSubLocation')
        cy.intercept('PUT', '**/location-sub/*').as('editSubLocation')
        cy.intercept('DELETE', '**/location-sub/*').as('deleteSubLocation')
        cy.wait(5000)

        cy.get('button#0 > .indicator-label').should('contain', 'Continue').click({force: true})
        cy.get('.stepper-nav > .current').should('contain', 'Locations')
        cy.get('button#2 > .indicator-label').should('contain', 'Continue').click({force: true})
        cy.get('.stepper-nav > .current').should('contain', 'Sub Locations')

        cy.wait('@fetchLocation')
        cy.wait('@fetchSubLocation')
        cy.get('[data-cy=table]').as('subLocationTable')
    })

    it('Check Wizard Sub Location Table', () => {
        // check page title
        cy.title().should('contain', 'Wizard')
        // Check Header Title
        cy.get('.stepper-nav > .current').should('contain', 'Sub Locations')
        cy.contains('List of Sub Locations').should('exist')
        // cy.get('div.text-black-600.fs-6 > p.mb-0').should('contain', 'You may also add locations. Sub Locations')
        // Check Add button and modal
        cy.contains('Add New Sub Location').should('exist')
        cy.get('[data-cy=btnAddSubLocationWizard]').click({force: true})
        cy.get('div.modal').find('div.modal-header').should('contain', 'Add a Sub Location')
        cy.get('div.modal-footer > button.btn-sm.btn.btn-secondary').should('contain', 'Cancel').click({force: true})
        // // check table header
        // cy.get('.current > .w-100 > .table-responsive > [data-cy=table] > thead > .fs-6 > :nth-child(1)').should('contain', 'Sub Location')
        // cy.get('[data-cy=table]').find('thead > tr > th').should('contain', 'Location')
        // cy.get('[data-cy=table]').find('[data-cy=editTable]:first').should('be.visible')
        // cy.get('[data-cy=table]').find('[data-cy=deleteTable]:first').should('be.visible')
    })

    it('Check error message if mandatory filed is empty', () => {
        // check error message if sub location filed is empty
        cy.get('[data-cy=btn-add-sub-location]').should('contain', 'Add New Sub Location').click({force: true})
        cy.get('div.modal').find('div.modal-header').should('contain', 'Add a Sub Location')
        cy.get('select.form-select.form-select-sm.form-select-solid[name*="location"]').select('Choose Location').blur({force: true})
        cy.get('div.fv-plugins-message-container.invalid-feedback').should('contain', 'Location is required.')
        cy.get('input[name*="names"]').clear({force: true}).blur({force: true})
        cy.get('div.fv-plugins-message-container.invalid-feedback').should('contain', 'Sub Location is required.')
        cy.get('div.modal-footer > button.btn-sm.btn.btn-secondary').should('contain', 'Cancel').click({force: true})
    })

    it('Check Add Sub Location', () => {
        // check input new sub location
        cy.get('[data-cy=btnAddSubLocationWizard]').click({force: true})
        cy.wait('@fetchLocation')
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
        cy.get('div.modal').find('div.modal-header').should('contain', 'Add a Sub Location')
        cy.get('[name=location]').type('{downarrow}').tab()
        cy.get('input[name*="names"]').type(`Surabaya`, {force: true})
        cy.get('.modal-footer > .btn-primary').contains('Add').click({force: true})
        cy.wait('@fetchLocation')
    })

    it('Check Edit Sub Location', () => {
        cy.wait(5000)
        cy.get('.stepper-nav > .current').should('contain', 'Sub Locations')
        // get location data contain 'Location Name'
        cy.get('[data-cy=table]')
        .find('tbody > tr.align-middle').first()
        .find('[data-cy=editTable]:first').click({force: true})

        // check modal
        cy.wait('@fetchLocation')
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
        // cy.get('div.modal').find('div.modal-header').should('contain', 'Edit a Sub Location')
        // // // edit data form
        // cy.get('#location').select('Okky', {force: true})
        // cy.get('input[name*="names"]').clear({force: true}).type(`Putra Jaya`, {force: true})
        // cy.get('.modal-footer > .btn-primary').contains('Save').click({force: true})
        // cy.wait('@editSubLocation')
    })

    it('Check Delete Sub Location', () => {
        cy.get('@subLocationTable')
          .find('tbody > tr.align-middle').filter(':contains("Bandung")').first()
          .find('[data-cy=deleteTable]:first').click({force: true})
        cy.get('[role=dialog]').should('have.class', 'fade modal show')
        // cy.get('button[type*="submit"] > .indicator-label').contains('Delete').click()
        // cy.wait('@deleteSubLocation')
    })

    it('Check Button Back To Step 2', () => {
        cy.get('.mr-2 > .btn').should('contain', 'Back').click({force: true})
        cy.get('.stepper-nav > .current').should('contain', 'Locations')
    })

    it('Check Button To Next Step (Step 4)', () => {
        cy.get('button#3 > .indicator-label').should('contain', 'Continue').click({force: true})
        cy.get('.stepper-nav > .current').should('contain', 'Categories')
    })
})

describe('Wizard Step 4 - Categories', () => {
    beforeEach( () => {
        cy.visit('setup/wizard')
        cy.intercept('GET', '**/setting/category/filter*').as('fetchCategory')
        cy.intercept('POST', '**/setting/category').as('addCategory')
        cy.intercept('PUT', '**/setting/category/*').as('editCategory')
        cy.intercept('DELETE', '**/setting/category/*').as('deleteCategory')
        cy.intercept('POST', '**/setting/category/bulk-delete').as('bulkDeleteCategory')
        cy.wait(5000)

        cy.get('button#0.btn.btn-primary > span.indicator-label').should('contain', 'Continue').click({force: true})
        cy.get('.stepper-nav > .current').should('contain', 'Locations')
        cy.get('button#2.btn.btn-primary > span.indicator-label').should('contain', 'Continue').click({force: true})
        cy.get('.stepper-nav > .current').should('contain', 'Sub Locations')
        cy.get('button#3.btn.btn-primary > span.indicator-label').should('contain', 'Continue').click({force: true})
        cy.get('.stepper-nav > .current').should('contain', 'Categories')
    })

    it('Check Wizard Categories Table', () => {
        cy.wait('@fetchCategory')
        // check page title
        cy.title().should('contain', 'Wizard')
        // Check Header Title
        cy.get('.stepper-nav > .current').should('contain', 'Categories')
        cy.get('[data-cy=headerWizardStep4]').should('contain', 'List of Categories')
        cy.get('[data-cy=descHeader1Category]').should('contain', 'Add category here. we have provided commonly used categories for you.')
        cy.get('[data-cy=descHeader2Category]').should('contain', 'Make them as broad or as specific as you want. Customise to your specific needs.')

        // // Check Add button and modal
        cy.get('[data-cy=btn-add-new-category]').should('contain', 'Add New Category').and('be.visible')
        cy.get('[data-cy=btn-add-new-category]').should('contain', 'Add New Category').click({force: true})
        cy.get('div.modal').find('div.modal-header').should('contain', 'Add a Category')
        cy.get('div.modal-footer > button.btn-sm.btn.btn-secondary').should('contain', 'Cancel').click({force: true})
        // // check table header
        cy.get('[data-cy=table]').find('thead > tr > th').should('contain', 'Category')
        cy.get('[data-cy=table]').find('[data-cy=editTable]:first').should('be.visible')
        cy.get('[data-cy=table]').find('[data-cy=deleteTable]:first').should('be.visible')
    })

    it('Check Error Message Categories', () => {
        cy.wait('@fetchCategory')
        // check error message if sub location filed is empty
        cy.get(':nth-child(2) > .d-flex > div > .btn > .indicator-label').should('contain', 'Add New Category').click({force: true})
        cy.get('div.modal').find('div.modal-header').should('contain', 'Add a Category')
        cy.get('input[name*="name"]').clear({force: true}).blur({force: true})
        cy.get('div.fv-plugins-message-container.invalid-feedback').should('contain', 'Category is required.')
        cy.get('div.modal-footer > button.btn-sm.btn.btn-secondary').should('contain', 'Cancel').click({force: true}).end()
    })

    it('Check Add Categories', () => {
        cy.wait('@fetchCategory')
        // check input new sub location
        cy.get('[data-cy=btn-add-new-category]').should('contain', 'Add New Category').click({force: true})
        cy.get('div.modal').find('div.modal-header').should('contain', 'Add a Category')
        cy.contains('If you want to add a new category of assets, you’re in the right spot. please fill in the fields below.').should('exist')
        cy.get('input[name*="name"]').clear({force: true}).type(`Air Conditioner ${date}`, {force: true})
        cy.get('.modal-footer > .btn-primary').contains('Add').click({force: true})//.end()
        cy.wait('@fetchCategory')
    })

    it('Check Edit Category', () => {
        // get location data contain 'Location Name'
        cy.get('[data-cy=table]')
        .find('tbody > tr.align-middle').filter(':contains("Computer")').first()
        .find('[data-cy=editTable]:first').click({force: true})
        // check modal
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
        cy.get('div.modal').find('div.modal-header').should('contain', 'Edit a Category')
        // edit data form
        cy.get('input[name*="name"]').clear({force: true}).type(`Computer Edit`, {force: true})
        cy.get('.modal-footer > .btn-primary').contains('Save').click({force: true})
        cy.wait('@fetchCategory')
    })

    it('Check Delete Categories', () => {
        cy.get('[data-cy=table]')
          .find('tbody > tr.align-middle').filter(':contains("Computer")').first()
          .find('[data-cy=deleteTable]:first').click({force: true})
        cy.get('[role=dialog]').should('have.class', 'fade modal show')
        cy.get('div.modal').find('div.modal-header').should('contain', 'Delete Category')
        // cy.get('button[type*="submit"] > .indicator-label').contains('Delete').click()
        // cy.wait('@deleteCategory')
    })

    it('Check Bulk Delete', () => {
        cy.get('.current > .w-100 > .table-responsive')
        .find('td.sticky-cus > div.form-check >  input[data-cy=checkbokBulk]').check({force: true, multiple: true })
        cy.get('button[data-cy=btnBulkDelete]').should('contain', "Delete Selected").and('be.visible')
        cy.get('button[data-cy=btnBulkDelete]').click({force: true})
        cy.get('[role=dialog]').should('have.class', 'fade modal show')
        cy.get('div.modal').find('div.modal-header').should('contain', 'Delete Category')
        // // cy.wait('@bulkDeleteCategory')
    })

    it('Check Button Back To Step 3', () => {
        cy.get('.mr-2 > .btn').should('contain', 'Back').click({force: true})
        cy.get('.stepper-nav > .current').should('contain', 'Sub Locations')
    })

    it('Check Button To Next Step (Step 5)', () => {
        cy.get('button#4.btn.btn-lg.btn-primary > span.indicator-label').should('contain', 'Continue').click({force: true})
        cy.get('.stepper-nav > .current').should('contain', 'Database')
    })

    it('Check Label Categorys', () => {
        if(!cy.contains('Add category here. we have provided commonly used categories for you.').should('exist') ) {
            cy.contains('Add category here. we have provided commonly used categories for you.').should('not.exist')
        } else {
            cy.contains('Add category here. we have provided commonly used categories for you.').should('exist')
        }

        if( !cy.contains('Make them as broad or as specific as you want. Customise to your specific needs.').should('exist') ) {
            cy.contains('Make them as broad or as specific as you want. Customise to your specific needs.').should('not.exist')
        } else {
            cy.contains('Make them as broad or as specific as you want. Customise to your specific needs.').should('exist')
        }

        if( !cy.contains('Category').should('exist') ) { cy.contains('Category').should('not.exist') } 
        else { cy.contains('Category').should('exist') }

        cy.get(':nth-child(2) > .d-flex > div > .btn').click({ force: true})
        if( !cy.contains('If you want to add a new category of assets, you’re in the right spot. please fill in the fields below.').should('exist') ) {
            cy.contains('If you want to add a new category of assets, you’re in the right spot. please fill in the fields below.').should('not.exist')
        } else {
            cy.contains('If you want to add a new category of assets, you’re in the right spot. please fill in the fields below.').should('exist')
        }
    })
})

describe('Wizard Step 5 - Database, Asset Custom Fields', () => {
    beforeEach( () => {
        cy.visit('setup/wizard')
        cy.intercept('GET', '**/setting/database/asset').as('fetchDatabase')
        cy.intercept('GET', '**/custom-field/filter*').as('fetchCF')
        cy.intercept('POST', '**/custom-field').as('addCF')
        cy.intercept('PUT', '**/custom-field/*').as('editCF')
        cy.intercept('DELETE', '**/custom-field/*').as('deleteCF')
        cy.wait(5000)

        cy.get('button#0 > .indicator-label').should('contain', 'Continue').click({force: true})
        cy.get('.stepper-nav > .current').should('contain', 'Locations')
        cy.get('button#2 > .indicator-label').should('contain', 'Continue').click({force: true})
        cy.get('.stepper-nav > .current').should('contain', 'Sub Locations')
        cy.get('button#3 > .indicator-label').should('contain', 'Continue').click({force: true})
        cy.get('.stepper-nav > .current').should('contain', 'Categories')
        cy.get('button#4 > .indicator-label').should('contain', 'Continue').click({force: true})
        cy.get('.stepper-nav > .current').should('contain', 'Database')

        cy.wait('@fetchDatabase')
        cy.get('table#database').as('DatabaseTable')
        cy.get('.current > .w-100 > .table-responsive > .wizard-custom-field').as('CFTable')
    })

    it('Check Wizard Asset Database Fields', () => {
        // check page title
        cy.title().should('contain', 'Wizard')

        // Check Header Title
        cy.get('.stepper-nav > .current > .stepper-label > .stepper-title').should('contain', 'Database')
        cy.get('.current > .w-100 > :nth-child(1) > .pb-lg-12 > .row > .fw-bolder').should('contain', 'Asset Database Fields')
        cy.get('.text-black-400 > :nth-child(1)').should('contain', 'Fill in the appropriate fields for your assets')
        cy.get('[data-cy=checkBoxAll]').check({force: true, multiple: true })

        // cy.get('.table > thead')
        // .find('tr.fw-bolder.fs-6.text-gray-800').filter(':contains("Location")')
        // .find('[data-cy=checkBoxYes]').check({force: true, multiple: true })
    })

    it('Check Asset Custom Fields Table', () => {
        cy.wait('@fetchCF')

        cy.get('.py-10 > .row > .fw-bolder').should('contain', 'Asset Custom Fields')
        cy.get('.py-10 > .text-black-400').should('contain', 'Add custom fields to join the others that we provided. Feel free to get creative.')

        // Check Add button and modal
        cy.get('[data-cy="AddCustomFiled"]').should('contain', 'Add Custom Field').click({force: true})
        cy.get('div.modal').find('div.modal-header').should('contain', 'Add a Custom Field')
        cy.get('div.modal-footer > button.btn-sm.btn.btn-secondary').should('contain', 'Cancel').click({force: true})

        // check table header
        cy.get('[data-cy=table]').find('thead > tr > th').should('contain', 'Field Name')
        cy.get('[data-cy=table]').find('thead > tr > th').should('contain', 'Data Type')
        cy.get('[data-cy=table]').find('thead > tr > th').should('contain', 'Category')
        cy.get('.current > .w-100 > .table-responsive > [data-cy=table] > tbody > :nth-child(1) > .sticky-cus > .d-flex > [data-cy=editTable]')
        cy.get('.current > .w-100 > .table-responsive > [data-cy=table] > tbody > :nth-child(1) > .sticky-cus > .d-flex > [data-cy=deleteTable]')
    })

    it('Check Add Asset Custom Fields', () => {
        // check error message if sub location filed is empty
         cy.get('[data-cy="AddCustomFiled"]').should('contain', 'Add Custom Field').click({force: true})
        cy.get('div.modal').find('div.modal-header').should('contain', 'Add a Custom Field')
        cy.get('[data-cy="fieldName"]').clear({force: true}).blur({force: true})
        cy.get('div.fv-plugins-message-container.invalid-feedback').should('contain', 'Custom Field Name is required')
        cy.get('select.form-select.form-select-sm.form-select-solid[name*="datatype"]').select('Select Data Type').blur({force: true})
        cy.get('div.fv-plugins-message-container.invalid-feedback').should('contain', 'Data Type is required.')
        cy.get('div.modal-footer > button.btn-sm.btn.btn-secondary').should('contain', 'Cancel').click({force: true}).end()

        // check input new sub location
        cy.get('[data-cy="AddCustomFiled"]').should('contain', 'Add Custom Field').click({force: true})
        cy.get('div.modal').find('div.modal-header').should('contain', 'Add a Custom Field')
        cy.get('[data-cy="fieldName"]').clear({force: true}).type(`Custom Field Text ${date}`, {force: true})
        cy.get('select.form-select.form-select-sm.form-select-solid[name*="datatype"]').select('Text').blur({force: true})
        cy.get('.modal-footer > .btn-primary').contains('Add').click({force: true}).end()
        cy.wait('@addCF')
    })

    it('Check Edit Asset Custom Fields', () => {
        // get location data contain 'Location Name'
        cy.get('@CFTable')
        .find('tbody > tr.align-middle').filter(':contains("Custom Field Text")').first()
        .find('[data-cy=editTable]:first').click({force: true})
        // check modal
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
        cy.get('div.modal').find('div.modal-header').should('contain', 'Edit a Custom Field')
        // edit data form
        cy.get('[data-cy="fieldName"]').clear({force: true}).type(`Custom Field123 ${date}`, {force: true})
        cy.get('.modal-footer > .btn-primary').contains('Save').click({force: true})
        // cy.wait('@editCF')
    })

    it('Check Delete Asset Custom Fields', () => {
        cy.get('@CFTable')
        //   .find('tbody > tr.align-middle').filter(':contains("FC Asset Text")')
        cy.get('.current > .w-100 > .table-responsive > [data-cy=table] > tbody > :nth-child(1) > .sticky-cus > .d-flex > [data-cy=deleteTable]')
        .click({force : true})
        cy.get('[role=dialog]').should('have.class', 'fade modal show')
        cy.get('button[type*="submit"] > .indicator-label').contains('Delete').click()
        // cy.wait('@deleteCF')
    })

    it.skip('Check Button Back To Step 4', () => {
        cy.get('.mr-2 > .btn').should('contain', 'Back').click({force: true})
        cy.get('.stepper-nav > .current').should('contain', 'Categories')
    })

    it('Check Button To Next Step (Step 6)', () => {
        cy.get('button#5 > .indicator-label').should('contain', 'Continue').click({force: true})
        // cy.get('.stepper-nav > .current').should('contain', 'Features')
    })
})

describe('Wizard Step 6 - Feature', () => {
    beforeEach( () => {
        cy.visit('setup/wizard')
        cy.intercept('**/api/**').as('fetchFeature')
        cy.wait('@fetchFeature')
        cy.wait(5000)

        cy.get('button#0 > .indicator-label').should('contain', 'Continue').click({force: true})
        cy.get('.stepper-nav > .current').should('contain', 'Locations')
        cy.get('button#2 > .indicator-label').should('contain', 'Continue').click({force: true})
        cy.get('.stepper-nav > .current').should('contain', 'Sub Locations')
        cy.get('button#3 > .indicator-label').should('contain', 'Continue').click({force: true})
        cy.get('.stepper-nav > .current').should('contain', 'Categories')
        cy.get('button#4 > .indicator-label').should('contain', 'Continue').click({force: true}).wait(2000)
        cy.get('.stepper-nav > .current').should('contain', 'Database')
        cy.get('button#5 > .indicator-label').should('contain', 'Continue').click({force: true})
        cy.get('.stepper-nav > .current').should('contain', 'Features')
    })

    it('Check Wizard Features Page', () => {
        // check page title
        cy.title().should('contain', 'Wizard')

        // Check Header Title
        cy.get('[data-cy=headerFeature]').should('contain', 'Features')
        cy.contains('Insurance Policies').should('exist')
        cy.contains('Inventory/Stock').should('exist')
        cy.contains('My Asset').should('exist')
        // cy.get('Maintenance').should('exist')
        cy.contains('Warranty').should('exist')
    })

    it('Check Button Back To Step 5', () => {
        cy.title().should('contain', 'Wizard')

        cy.get('.mr-2 > .btn').should('contain', 'Back').click({force: true})
        cy.get('.stepper-nav > .current').should('contain', 'Database')
    })

    it('Check Button To Next Step (Step 7)', () => {
        cy.title().should('contain', 'Wizard')
        cy.get('button#6 > .indicator-label').should('contain', 'Continue').click({force: true})
        cy.get(':nth-child(2) > .d-flex > .m-0').should('contain', 'Done!')
    })
})

describe('Complete Wizard', () => {
    beforeEach( () => {
        cy.visit('setup/wizard')
        cy.intercept('**/api/**').as('fetchFeature')
        cy.wait('@fetchFeature')
        cy.wait(5000)

        cy.get('button#0 > .indicator-label').should('contain', 'Continue').click({force: true})
        cy.get('.stepper-nav > .current').should('contain', 'Locations')
        cy.get('button#2 > .indicator-label').should('contain', 'Continue').click({force: true})
        cy.get('.stepper-nav > .current').should('contain', 'Sub Locations')
        cy.get('button#3 > .indicator-label').should('contain', 'Continue').click({force: true})
        cy.get('.stepper-nav > .current').should('contain', 'Categories')
        cy.get('button#4 > .indicator-label').should('contain', 'Continue').click({force: true}).wait(2000)
        cy.get('.stepper-nav > .current').should('contain', 'Database')
        cy.get('button#5 > .indicator-label').should('contain', 'Continue').click({force: true}).wait(2000)
        cy.get('.stepper-nav > .current').should('contain', 'Features')
        cy.get('button#6 > .indicator-label').should('contain', 'Continue').click({force: true})
    })

    it('Check Complete Page', () => {
        // check page title
        cy.title().should('contain', 'Wizard')

        // Check Header Title
        cy.get('[data-cy=headerCompleteWizard]').should('contain', `You're Done!`)
    })

    it('Check Button Back To Step 6', () => {
        cy.get('[data-cy=btnBackCompleteWizard]').should('contain', 'Back').click({force: true})
        cy.wait(3000)
        cy.get('.stepper-nav > .current').should('contain', 'Features')
    })

    it('Submit Complete Button', () => {
        cy.get('[data-cy=btnCompleteWizard]').should('contain', 'Complete')
        cy.get('[data-cy=btnCompleteWizard]').click({force: true})
        // cy.visit('/dashboard')
    })
})
