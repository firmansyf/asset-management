/* eslint-disable cypress/no-unnecessary-waiting */
import moment from 'moment'
beforeEach(cy.login)

describe('FE-1093 (CLONE - [SETUP] block deletion of default company)', () => {

  beforeEach(() => {
    cy.visit('setup/settings/companies')
    cy.intercept('GET', '**/setting/company*').as('getCompany')
  })

  it('Validation on Delete', () => {
    cy.wait('@getCompany').its('response.statusCode').should('eq', 200)
    cy.get("[data-cy=editTable]").first().should('be.visible')
    cy.get("[data-cy=deleteTable]").first().should('be.visible').click({force: true})
    cy.get('.modal-body').should('contain', 'to delete')
  })

  it('Should Export to PDF', () => {
    cy.get('#dropdown-basic').click({force: true})
    cy.get('[data-cy=exportToPDF]').click({force: true})
    cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
    cy.get('.modal-footer > .btn-primary').click({force: true})
  })
})

describe('Setup > Settings > Company', () => {
  beforeEach(() => {
    cy.visit('setup/settings/companies')
    // cy.intercept('GET', '/media/**', {delayMs: 15000}).as('fetchMedia')
    cy.intercept('GET', '**/setting/company*').as('getCompany')
    cy.intercept('POST', '**/setting/company').as('addCompany')
    cy.intercept('PUT', '**/setting/company/**').as('updateCompany')
    cy.intercept('DELETE', '**/setting/company/**').as('deleteCompany')
    cy.wait('@getCompany')
  })

  it('Search Company', () => {
    // cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
    cy.get('#kt_filter_search').type('Kebon sirih',{force: true})
    cy.get('.table-responsive table').within(() => {
      cy.get('tbody').find('tr.align-middle').should('contain', 'Butterseller')
    })
  })

  it('Table Company', () => {
    // cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
    cy.wait('@getCompany').then(() => {
      cy.get('table > tbody > tr').should('have.length.greaterThan', 0)
    })
  })

  it('Check filter Company', () => {
    cy.get('[data-cy=filterAll]').click({force: true})
    cy.get('input#column-1').check()
    cy.get('button.fs-8.bg-white.dropdown-toggle.btn.btn-transparent.btn-sm').click({force: true})
    cy.get('input[name=address]').eq(0).click({force: true})
    cy.get('#address-1').click({force: true, multiple: true})
    cy.get('input[name=address]').eq(0).click({force: true})
    cy.get('#address-2').click({force: true, multiple: true}).blur({force: true})
    cy.intercept('GET', '**/setting/company?page=1&limit=10*').as('fetchCompanyFilter')
    cy.get('.table-responsive > .table').as('CompanyTableFilter')
    cy.get('@CompanyTableFilter').within(() => {
        cy.get('tbody').find('tr.align-middle').should('contain', 'Kebon sirih timur')
    })
  })

  it('Sort Company', () => {
    // cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
    cy.wait('@getCompany').then(() => {
      cy.get('table > tbody > tr').should('have.length.greaterThan', 0)

      cy.wait(5000)
      cy.get('.fw-bolder > :nth-child(3)').click({force:true})
    })
  })

  it('Pagination Company', () => {
    // cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
    cy.wait('@getCompany').then(() => {
      cy.get('table > tbody > tr').should('have.length.greaterThan', 0)

      cy.wait(5000)
      cy.get('.page-item.next > .page-link').click({force:true})
    })
  })

  it('Add Company', () => {
    // cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
    cy.wait('@getCompany').then(() => {
      cy.get("[data-cy=addCompany]").click({force: true})
      cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

      cy.get('form').within( () => {
        cy.get('input[name=name]').clear({force:true})
        cy.get('input[name=name]').type('Test Company : ' + moment().format('mmss'), {force:true})

        cy.get('input[name=address_1]').clear({force:true})
        cy.get('input[name=address_1]').type('Address ' + moment().format('mmss'), {force:true})

        cy.get('select[name=country_code]').select('MY', {force: true})

        cy.get('input[name=state]').clear({force:true})
        cy.get('input[name=state]').type('State ' + moment().format('mmss'), {force:true})

        cy.get('input[name=city]').clear({force:true})
        cy.get('input[name=city]').type('City ' + moment().format('mmss'), {force:true})

        cy.get('input[name=street]').clear({force:true})
        cy.get('input[name=street]').type('Street ' + moment().format('mmss'), {force:true})

        cy.get('input[name=postcode]').clear({force:true})
        cy.get('input[name=postcode]').type(moment().format('mmss'), {force:true})

        cy.get('select[name=financial_month]').select(Math.floor(Math.random() * 13), {force: true})
        cy.get('select[name=financial_day]').select(Math.floor(Math.random() * 32), {force: true})

        // cy.fixture('images/logo.png').then( fileContent => {
        //   cy.get('input[type=file]').attachFile({
        //     fileContent: fileContent.toString(),
        //     fileName: 'logo.png',
        //     encoding: 'utf-8',
        //     mimeType: 'image/png'
        //   })
        // })
        cy.get('.modal-footer > .btn-primary').click()
        cy.wait('@addCompany').its('response.statusCode').should('be.oneOf', [200, 201])
        cy.wait('@getCompany')
      })
    })
  })

  it.only('Add Company ( Check Notif Mandatory )', () => {
    cy.wait('@getCompany').then(() => {
      cy.get("[data-cy=addCompany]").click({force: true})
      cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
      cy.wait(1000)
      cy.get('.modal-footer > .btn-primary').click({force: true})

      cy.wait(2000)
      cy.contains('This company name is required').should('exist')
      // cy.contains('This address is required').should('exist')
      // cy.contains('This street is required').should('exist')
      cy.contains('This city is required').should('exist')
      cy.contains('This state is required').should('exist')
      cy.contains('This post code is required').should('exist')
      cy.contains('This country is required').should('exist')
      cy.contains('Please fill in mandatory field(s) to continue.').should('exist')
    })
  })

  it('Update Company', () => {
    // cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
    cy.wait('@getCompany').then(() => {
      cy.get("[data-cy=editTable]").last().click({force: true})
      cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

      cy.get('form').within( () => {
        cy.get('input[name=name]').clear({force:true})
        cy.get('input[name=name]').type('Test Company : ' + moment().format('mmss'), {force:true})

        cy.get('input[name=address_1]').clear({force:true})
        cy.get('input[name=address_1]').type('Address ' + moment().format('mmss'), {force:true})

        cy.get('select[name=country_code]').select('MY', {force: true})

        cy.get('input[name=state]').clear({force:true})
        cy.get('input[name=state]').type('State ' + moment().format('mmss'), {force:true})

        cy.get('input[name=city]').clear({force:true})
        cy.get('input[name=city]').type('City ' + moment().format('mmss'), {force:true})

        cy.get('input[name=street]').clear({force:true})
        cy.get('input[name=street]').type('Street ' + moment().format('mmss'), {force:true})

        cy.get('input[name=postcode]').clear({force:true})
        cy.get('input[name=postcode]').type(moment().format('mmss'), {force:true})

        cy.get('select[name=financial_month]').select(Math.floor(Math.random() * 13), {force: true})
        cy.get('select[name=financial_day]').select(Math.floor(Math.random() * 32), {force: true})

        // cy.fixture('images/logo.png').then( fileContent => {
        //   cy.get('input[type=file]').attachFile({
        //     fileContent: fileContent.toString(),
        //     fileName: 'logo.png',
        //     encoding: 'utf-8',
        //     mimeType: 'image/png'
        //   })
        // })
        cy.get('.modal-footer > .btn-primary').click()
        cy.wait('@updateCompany').its('response.statusCode').should('be.oneOf', [200, 201])
        cy.wait('@getCompany')
      })
    })
  })

  it('Delete Company', () => {
    // cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
    cy.wait('@getCompany').then(() => {
      cy.get("[data-cy=deleteTable]").last().click({force: true})

      cy.wait(5000)
      cy.get('.modal-footer > .btn-primary').click({force: true})
      cy.wait('@deleteCompany').its('response.statusCode').should('be.oneOf', [200, 201])
      cy.wait('@getCompany')
    })
  })

  it('Delete Bulk Company', () => {
    cy.get('.table-responsive > .table')
    .find('tbody > tr.align-middle').filter(':contains("Planter")')
    .find('td.sticky-cus > div.form-check > input[data-cy=checkbokBulk]').check({force: true, multiple: true })
    cy.get('button[data-cy=btnBulkDelete]').should('contain', "Delete Selected").and('be.visible')
    cy.get('button[data-cy=btnBulkDelete]').click({force: true})
    cy.intercept('POST', '**/bulk-delete/company*').as('deleteBulkCompany')
    // cy.wait('@deleteBulkCompany').its('response.statusCode').should('be.oneOf', [200, 201])
  })

  it('Detail Company', () => {
    // cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
    cy.wait('@getCompany').then(() => {
      cy.get("[data-cy=viewTable]").first().click({force: true})
    })
  })

  it('Export to PDF', () => {
    cy.get('[data-cy=actions] button', ).click({force: true})
    cy.get('.dropdown > .show.dropdown').find('[data-cy=exportToPDF]').click({force: true})
    cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
  })

  it('Export to Excel', () => {
    cy.get('[data-cy=actions] button', ).click({force: true})
    cy.get('.dropdown > .show.dropdown').find('[data-cy=exportToExcel]').click({force: true})
    cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
  })
})

describe('[ Company ] Setup Columns', () => {
  beforeEach(() => {
    cy.visit('setup/settings/company/columns')
    // cy.intercept('GET', '/media/**', {delayMs: 15000}).as('fetchMedia')
    cy.intercept('GET', '**/setting/company/setup-column').as('getCompany')
    cy.intercept('POST', '**/setting/company/setup-column').as('addCompany')
  })

  it('Setup Columns Company', () => {
    // cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
    cy.wait('@getCompany').then(() => {
      cy.wait(5000)
      cy.get('.card-footer > .btn-primary').click({force:true})
      cy.wait('@addCompany').its('response.statusCode').should('be.oneOf', [200, 201])
    })
  })

  it('Cancel Setup Columns Company', () => {
    // cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
    cy.wait('@getCompany').then(() => {
      cy.wait(5000)
      cy.get('.btn-secondary').click({force:true})
    })
  })
})