export class FeatureAccess {
    users: Number = 0;
    visits: Number = 0;
    leads: Number = 0;
    calculators: Number = 0;
    embedding: { active: boolean } = { active: false };

    isLoaded: boolean = false;

    lead_generation: { active: boolean, email_check : boolean, restrict_duplicate: boolean } = {
        active: false,
        email_check: false,
        restrict_duplicate: false
    };
    custom_script: { active: boolean } = {
        active: false
    };
    analytics: {
        active: boolean, user_details: boolean,
        traffic_details: boolean, spreadsheet: boolean,
        summary: boolean, user_details_limited: boolean,
        funnel: boolean
    }
    = {
        active: false,
        user_details: false,
        traffic_details: false,
        spreadsheet: false,
        summary: false,
        user_details_limited: false,
        funnel: false
    };

    cta: { active: boolean, redirect_url: boolean, like_follow: boolean, shares: boolean }
    = {
        active: false,
        redirect_url: false,
        like_follow: false,
        shares: false
    };

    custom_styling: {
        active: Boolean, background_image: Boolean, custom_tints: Boolean, predefined_color_themes: Boolean,
        custom_themes: Boolean, fonts: Boolean, html_editor: Boolean
    }
    = {
        active: false,
        background_image: false,
        custom_tints: false,
        predefined_color_themes: false,
        custom_themes: false,
        fonts: false,
        html_editor: false
    };
    integrations: { active: boolean, marketo: boolean, marketo_limited: boolean, salesforce: boolean, salesforce_limited: boolean, mailchimp: boolean,
                     mailchimp_limited: boolean,  zapier_limited: boolean, zapier_loaded: boolean,
                     active_campaign: boolean, active_campaign_limited: boolean, get_response: boolean,
                      get_response_limited: boolean,aweber :boolean, aweber_limited :boolean, hubspot : boolean, hubspot_limited : boolean, drip:boolean, drip_limited : boolean, pardot :boolean, pardot_limited: boolean, emma : boolean, emma_limited : boolean,
                    slack: boolean, slack_limited: boolean, webhook :boolean}
    = {
        active: false,
        marketo: false,
        marketo_limited: false,
        salesforce: false,
        salesforce_limited: false,
        mailchimp: false,
        mailchimp_limited: false,
        zapier_limited: false,
        zapier_loaded: false,
        active_campaign: false,
        active_campaign_limited: false,
        get_response: false,
        get_response_limited: false,
        aweber : false,
        aweber_limited : false,
        hubspot : false,
        hubspot_limited : false,
        drip: false,
        drip_limited : false,
        pardot : false,
        pardot_limited : false,
        emma : false,
        emma_limited : false,
        slack: true,
        slack_limited: true,
        webhook : false
    };

    custom_branding: {
        active: boolean, logo_poweredby: boolean, edit_cta_text: boolean,
        share_text: boolean, cta_build_similar_calc: boolean
    }
    = {
        active: false,
        logo_poweredby: false,
        share_text: false,
        cta_build_similar_calc: false,
        edit_cta_text: false
    };

    priority_support: { active: boolean } = { active: false };

    account_manager: { active: boolean } = { active: false };

    api: { active: boolean } = { active: false };

    training: { active: boolean } = { active: false };

    confirmation_emails: { active: boolean, to_self: boolean, to_user: boolean }
    = {
        active: false,
        to_self: false,
        to_user: false
    };

    logic_jump : {active : boolean} = {active : false};

    charts : {active : boolean} = {active : false};

    cname : {active : boolean} = {active : false};
    webhook : {active : boolean} = {active : false};

    conditional_messaging: { active: boolean } = { active: false };
    formula_operators: { active: boolean, simple_operators: boolean, all_operators: boolean }
    = {
        active: false,
        simple_operators: false,
        all_operators: false
    };
    templates: { active: boolean, one_page_card: boolean, sound_cloud: boolean,
        inline_temp: boolean, one_page_card_new: boolean, sound_cloud_new: boolean,
         inline_temp_new: boolean, experian : boolean, template_five : boolean }
    = {
        active: true,
        one_page_card: false,
        sound_cloud: false,
        inline_temp: false,
        one_page_card_new : false,
        sound_cloud_new: false,
        inline_temp_new: false,
        experian : false,
        template_five : false
    };

    variable_cta: { active: boolean } = { active: false };
    disclaimers: { active: boolean } = { active: false };
    real_time_results: { active: boolean } = { active: true };

    constructor(features: any) {
        if (features) {
            var self = this;
            self.isLoaded = true;
            for (let keys in self) {
                if (features[keys]) {
                    if (typeof self[keys] === 'number') {
                        self[keys] = features[keys];
                    }
                    for (let sub in self[keys]) {
                        if (features[keys][sub]) {
                            self[keys][sub] = features[keys][sub];
                        } else {
                            //console.log(sub, "elseeee sub_keyss");
                        }
                    }
                } else {
                    //console.log(keys, "elseee keyssss");
                }
            }
            self.templates["one_page_card_new"] = features.templates.one_page_card;
            self.templates["sound_cloud_new"] = features.templates.sound_cloud;
            self.templates["inline_temp_new"] = features.templates.inline_temp;

            //allow everyone to use logic jump and charts till 1st May
            let date = new Date();
            let month = date.getMonth();
            if (month < 4) {
                self.charts.active = true;
                self.logic_jump.active = true;
            }
            //console.log(self, '***************************',features);
        }
    }


}
