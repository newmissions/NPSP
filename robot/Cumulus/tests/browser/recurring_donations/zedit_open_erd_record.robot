*** Settings ***

Resource        robot/Cumulus/resources/NPSP.robot
Library         cumulusci.robotframework.PageObjects
...             robot/Cumulus/resources/NPSPSettingsPageObject.py
...             robot/Cumulus/resources/ContactPageObject.py
...             robot/Cumulus/resources/RecurringDonationsPageObject.py
...             robot/Cumulus/resources/OpportunityPageObject.py
Suite Setup     Run keywords
...             Open Test Browser
...             Setup Test Data
...             Enable RD2
Suite Teardown  Delete Records and Close Browser

*** Keywords ***

Setup Test Data
        #Create a Recurring Donation
        &{contact1_fields}=   Create Dictionary                     Email=rd2tester@example.com
        &{recurringdonation_fields} =	Create Dictionary           Name=ERD Open Recurring Donation
        ...                                                         npe03__Installment_Period__c=Yearly
        ...                                                         npe03__Amount__c=100
        ...                                                         npe03__Open_Ended_Status__c=Open
        ...                                                         npe03__Date_Established__c=2019-07-08
        ...                                                         Status__c=Active
        ...                                                         Day_of_Month__c=15
        ...                                                         InstallmentFrequency__c=1
        ...                                                         PaymentMethod__c=Check

        Setupdata   contact         ${contact1_fields}             recurringdonation_data=${recurringdonation_fields}


*** Test Cases ***

Edit An Enhanced Recurring donation record of type open
    [Documentation]               After creating an open recurring donation using API, The test ensures that the record
     ...                          can be edited from the ui. A status of closed and the reason for closure can be specified
     ...                          Verifies the opportunity status reflects the right status after closing


    [tags]                                 unstable               W-040346            feature:RD2

    Go To Page                             Details
    ...                                    npe03__Recurring_Donation__c
    ...                                    object_id=${data}[contact_rd][Id]
    Wait Until Loading Is Complete
    Edit Recurring Donation
    ...                                    Status=Closed
    ...                                    Status Reason=Commitment Completed

    ${rd_id}                               Save Current Record ID For Deletion       npe03__Recurring_Donation__c

    # Verify that "no active schedules are present" messages appear
    Verify Schedule Warning Messages Present

    #Validate the number of opportunities on UI, Verify Opportinity got created in the backend
    Validate Related Record Count           Opportunities                                                    1
    @{opportunity1} =                       API Query Opportunity For Recurring Donation                   ${rd_id}
    Store Session Record                    Opportunity                                                    ${opportunity1}[0][Id]

    #validate the stage on opportunity is Closed Lost
    Go To Page                              Details                        Opportunity                     object_id=${opportunity1}[0][Id]
    Wait Until Loading Is Complete
    Navigate To And Validate Field Value    Stage                          contains                        Closed Lost