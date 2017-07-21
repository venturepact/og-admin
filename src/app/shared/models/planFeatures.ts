
import {environment} from "../../../environments/environment";
export class PlanFeatures{
    public planLimit:PlanLimit;
    public features:Features[];
    public cycles:Cycle[];

    public freelancer_features;
    public essentials_appsumo_features;
    public essentials_features;
    public business_appsumo_features;
    public business_features;
    public enterprise_appsumo_features;
    constructor(planFeature: any,isAppsumoUser) {
        let plan = planFeature.plan;
        if(planFeature){
            this.planLimit = new PlanLimit(plan.plan);
            this.features = [];
            plan.features = this.populateFeatures(plan.plan,planFeature.current_plan,isAppsumoUser);
            // for(var i = 0; i< plan.features.length; i++){
            //     this.features.push(new Features(plan.features[i]));
            // }
            if(plan.features){
                for(var i = 0; i< plan.features.length; i++){
                    let features = new Features(null);
                    features.active = true;
                    features.feature = new Feature(null);
                    features.feature.name = plan.features[i];
                    features.feature.active = true;
                    features.feature.description = this.fetchDescription(plan.features[i]);
                    this.features.push(features);
                }
            }else{
                this.features.push(null);
            }

            this.cycles = [];
            for(var i = 0; i< plan.cycles.length; i++){
                this.cycles.push(new Cycle(plan.cycles[i]));
            }
        }
    }

    fetchDescription(feature){
        switch(feature){
            case 'Basic Analytics':
                return "You get access to high level conversion and traffic analytics as well as leads' contact information.";
            case 'Basic Customizations':
                return "Use your brand logo, get predefined color palettes and add social share call to actions to drive viral traffic.";
            case 'Advanced Analytics':
                return "You get access to detailed conversion and traffic analytics as well as leads' contact information and responses.";
            case 'Standard Customizations':
                return "You can show custom messages, have custom call to actions, use your brand colors & use advanced formulas.";
            case 'Basic Integrations':
                return "You can sync user's contact information using Zapier and native integrations.";
            case 'Advanced Customizations':
                return "You can show custom messages, have custom call to actions, use your brand colors & use advanced formulas.";
            case 'Advanced Integrations':
                return "Send all lead data including contact information and quiz responses.";
            case 'Export Spreadsheet':
                return "View (or download) lead contact information in a Google spreadsheet.";
            case 'Logic Jump':
                return "Jump questions based on conditions & make your calculators more interactive.";
            case 'Charts':
                return "Add interactive line, bar and pie charts & make results more interactive.";
            default:
                return null;
        }
    }
    populateFeatures(plan,current_plan,isAppsumoUser){
        // this.features = [];
        // this.freelancer_features = [
        //     "Basic Template",
        //     "Basic Analytics",
        //     "Basic Customizations",
        //     "Outgrow Branding",
        //     "Export Spreadsheet",
        //     "Support Docs",
        //     "No Logic Jump",
        //     "No Charts"
        // ];



      this.freelancer_features = [
        {
          featureName: "Lead generation",
          name:"Full Access",
          description: "Add Lead generation capabilities to any calculator or quiz."
        },
        {
          featureName: "Domain Hosting",
          name: "Outgrow Domain",
          description: "Experiences are hosted on 'yourcompany."+environment.APP_EXTENSION+"'"
        },
        {
          featureName: "Charts and Graphs",
          name: "No Access",
          description: ""
        },
        {
          featureName: "Display Customizations",
          name: "Standard Access",
          description: "Use your brand logo and customize look and feel using predefined color palettes."
        },
        {
          featureName: "Branding",
          name: "Outgrow Branding",
          description: "A small discreet Outgrow logo at the bottom of the screen and a subtitle plug-in social shares."
        },
        {
          featureName: "Integrations",
          name: "Excel Export",
          description: "View (or download) lead contact information in a Google spreadsheet."
        },
        {
          featureName: "Templates",
          name: "Basic Template",
          description: ""
        },
        {
          featureName: "Call To Actions",
          name: "Basic CTAs",
          description: "Add Facebook, Twitter and Linkedin share buttons to power viral sharing."
        },
        {
          featureName: "Formulas",
          name: "Basic Operators",
          description: "You can use basic mathematical operators like +,-,x,/."
        },
        {
          featureName: "Logic JUMP",
          name: "No Access",
          description: ""
        },
        {
          featureName: "Analytics",
          name: "Full Analytics Reports",
          description: "Traffic Details, Lead Data and User responses."
        },
        {
          featureName: "Support",
          name: "Support Docs",
          description: "You will have access to support docs."
        }
      ];

        // this.essentials_appsumo_features = [
        //     "Premium Templates",
        //     "Advanced Analytics",
        //     "Standard Customizations",
        //     "Light Outgrow Branding",
        //     "Basic Integrations",
        //     "Basic Support",
        //     "Logic Jump",
        //     "No Charts"
        // ];
      this.essentials_appsumo_features = [
        {
          featureName: "Lead generation",
          name:"Full Access",
          description: "Add Lead generation capabilities to any calculator or quiz."
        },
        {
          featureName: "Domain Hosting",
          name: "Outgrow Domain",
          description: "Experiences are hosted on 'yourcompany."+environment.APP_EXTENSION+"'"
        },
        {
          featureName: "Charts & Graphs",
          name: "No Access",
          description: ""
        },
        {
          featureName: "Display Customizations",
          name: "Standard Access",
          description: "Use your brand logo and customize look and feel using predefined color palettes."
        },
        {
          featureName: "Branding",
          name: "Outgrow Branding",
          description: "A small discreet Outgrow logo at the bottom of the screen and a subtitle plug-in social shares."
        },
        {
          featureName: "Integrations",
          name: "Excel Export",
          description: "You can sync user's contact information using Zapier or over 10 direct integrations with tools like MailChimp, Aweber, Hubspot, Marketo etc."
        },
        {
          featureName: "Templates",
          name: "Basic Template",
          description: ""
        },
        {
          featureName: "Call to Actions",
          name: "Advanced CTAs",
          description: "Add Facebook, Twitter and Linkedin share buttons to power viral sharing."
        },
        {
          featureName: "Formula",
          name: "Basic Operators",
          description: "You can use basic mathematical operators like +,-,x,/."
        },
        {
          featureName: "Logic Jump",
          name: "No Access",
          description: ""
        },
        {
          featureName: "Analytics",
          name: "Full Analytics Reports",
          description: "Traffic Details, Lead Data and User responses."
        },
        {
          featureName: "Support",
          name: "Basic",
          description: "You will have access to support docs."
        }
      ];
        // this.essentials_features = [
        //     "Premium Templates",
        //     "Advanced Analytics",
        //     "Standard Customizations",
        //     "Light Outgrow Branding",
        //     "Basic Integrations",
        //     "Basic Support",
        //     "Logic Jump",
        //     "No Charts"
        // ];
      this.essentials_features = [
        {
          featureName: "Lead generation",
          name:"Full Access",
          description: "Add Lead generation capabilities to any calculator or quiz."
        },
        {
          featureName: "Domain Hosting",
          name: "Outgrow Domain",
          description: "Experiences are hosted on 'yourcompany."+environment.APP_EXTENSION+"'"
        },
        {
          featureName: "Charts and Graphs",
          name: "No Access",
          description: ""
        },
        {
          featureName: "Display Customizations",
          name: "Standard Access",
          description: "Use your brand logo and customize look and feel using predefined color palettes."
        },
        {
          featureName: "Branding",
          name: "Light Outgrow Branding",
          description: "A small discreet Outgrow logo at the bottom of the screen."
        },
        {
          featureName: "Integrations",
          name: "Full Access",
          description: "You can sync user's contact information using Zapier or over 10 direct integrations with tools like MailChimp, Aweber, Hubspot, Marketo etc."
        },
        {
          featureName: "Templates",
          name: "All Templates",
          description: ""
        },
        {
          featureName: "Call To Actions",
          name: "Advanced CTAs",
          description: "Add Facebook, Twitter and Linkedin share buttons as well as Facebook like and Twitter follow buttons to improve social following. You can also redirect users to external web pages."
        },
        {
          featureName: "Formulas",
          name: "Advanced Operators",
          description: "You can use any mathematical(^, log etc) or logical (if then, average etc) operators."
        },
        {
          featureName: "Logic JUMP",
          name: "Full Access",
          description: "Apply logic jump to supported templates to improve personalization."
        },
        {
          featureName: "Analytics",
          name: "Full Analytics Reports",
          description: "Traffic Details, Lead Data and User responses."
        },
        {
          featureName: "Support",
          name: "Basic",
          description: "You will have access to support docs as well as email support. We will try to answer all queries within 24-48 hours."
        }
      ];
        // this.business_appsumo_features = [
        //     "Premium Templates",
        //     "Advanced Analytics",
        //     "Advanced Customizations",
        //     "No Outgrow Branding",
        //     "Advanced Integrations",
        //     "Priority Support",
        //     "Logic Jump",
        //     "Charts"
        // ];
      this.business_appsumo_features = [
        {
          featureName: "Lead generation",
          name:"Advanced Access",
          description: "Ensure each leads authenticity & reduce 'fake' leads via advanced email validation."
        },
        {
          featureName: "Domain Hosting",
          name: "Outgrow Domain",
          description: "Experiences are hosted on 'yourcompany."+environment.APP_EXTENSION+"'"
        },
        {
          featureName: "Charts and Graphs",
          name: "No Access",
          description: ""
        },
        {
          featureName: "Display Customizations",
          name: "Standard Access",
          description: "Use your brand logo and customize look and feel using predefined color palettes."
        },
        {
          featureName: "Branding",
          name: "Light Outgrow Branding",
          description: "A small discreet Outgrow logo at the bottom of the screen."
        },
        {
          featureName: "Integrations",
          name: "Full Access",
          description: "Send all lead data using direct integrations, Zapier as well as Webhooks and our highly versatile API."
        },
        {
          featureName: "Templates",
          name: "All Templates",
          description: ""
        },
        {
          featureName: "Call To Actions",
          name: "Advanced CTAs",
          description: "Add Facebook, Twitter and Linkedin share buttons as well as Facebook like and Twitter follow buttons to improve social following. You can also redirect users to external web pages."
        },
        {
          featureName: "Formulas",
          name: "Advanced Operators",
          description: "You can use any mathematical(^, log etc) or logical (if then, average etc) operators."
        },
        {
          featureName: "Logic JUMP",
          name: "Full Access",
          description: "Apply logic jump to supported templates to improve personalization."
        },
        {
          featureName: "Analytics",
          name: "Full Analytics Reports",
          description: "Traffic Details, Lead Data and User responses."
        },
        {
          featureName: "Support",
          name: "Basic",
          description: "You will have access to support docs as well as email support. We will try to answer all queries within 24-48 hours."
        }
      ];
        // this.business_features = [
        //     "Premium Templates",
        //     "Advanced Analytics",
        //     "Advanced Customization",
        //     "No Outgrow Branding",
        //     "Advanced Integrations",
        //     "Priority Support",
        //     "Logic Jump",
        //     "Charts"
        // ];
      this.business_features = [
        {
          featureName: "Lead generation",
          name:"Advanced Access",
          description: "Ensure each leads authenticity & reduce 'fake' leads via advanced email validation."
        },
        {
          featureName: "Domain Hosting",
          name: "Custom Domain",
          description: "Experiences are hosted on 'subdomain.yourcompany.co"
        },
        {
          featureName: "Charts and Graphs",
          name: "Full Access",
          description: "Increase interactivity by adding charts, graphs and tables in your experiences."
        },
        {
          featureName: "Display Customizations",
          name: "Full Access",
          description: "Use your brand logo and customize look and feel using custom color, tinges and custom HTML."
        },
        {
          featureName: "Branding",
          name: "No Outgrow Branding",
          description: "No Outgrow branding is displayed on any screen."
        },
        {
          featureName: "Integrations",
          name: "Advanced Access",
          description: "Send all lead data using direct integrations, Zapier as well as Webhooks and our highly versatile API."
        },
        {
          featureName: "Templates",
          name: "All Templates",
          description: ""
        },
        {
          featureName: "Call To Actions",
          name: "Advanced CTAs",
          description: "Add Facebook, Twitter and Linkedin share buttons as well as Facebook like and Twitter follow buttons to improve social following. You can also redirect users to external web pages."
        },
        {
          featureName: "Formulas",
          name: "Advanced Operators",
          description: "You can use any mathematical(^, log etc) or logical (if then, average etc) operators."
        },
        {
          featureName: "Logic JUMP",
          name: "Full Access",
          description: "Apply logic jump to supported templates to improve personalization."
        },
        {
          featureName: "Analytics",
          name: "Advanced Analytics Reports",
          description: "Traffic Details, Lead Data, User responses & Funnel Visualization."
        },
        {
          featureName: "Support",
          name: "Priority",
          description: "You will have access to support docs, email support as well as live chat."
        }
      ];
        // this.enterprise_appsumo_features = [
        //     "Premium & Custom Templates",
        //     "Advanced Analytics",
        //     "Advanced Customizations",
        //     "No Outgrow Branding",
        //     "End to End Integrations",
        //     "Account Manager",
        //     "Logic Jump",
        //     "Charts"
        // ];
      this.enterprise_appsumo_features = [
        {
          featureName: "Lead generation",
          name:"Advanced Access",
          description: "Ensure each leads authenticity & reduce 'fake' leads via advanced email validation."
        },
        {
          featureName: "Domain Hosting",
          name: "Custom Domain",
          description: "Experiences are hosted on 'subdomain.yourcompany.co"
        },
        {
          featureName: "Charts and Graphs",
          name: "Full Access",
          description: "Increase interactivity by adding charts, graphs and tables ri your experiences."
        },
        {
          featureName: "Display Customizations",
          name: "Full Access",
          description: "Use your brand logo and customize look and feel using custom color, tinges and custom HTML."
        },
        {
          featureName: "Branding",
          name: "No Outgrow Branding",
          description: "No Outgrow branding is displayed on any screen."
        },
        {
          featureName: "Integrations",
          name: "Advanced Access",
          description: "Send all lead data using direct integrations, Zapier as well as Webhooks and our highly versatile API."
        },
        {
          featureName: "Templates",
          name: "All Templates",
          description: ""
        },
        {
          featureName: "Call To Actions",
          name: "Advanced CTAs",
          description: "Add Facebook, Twitter and Linkedin share buttons as well as Facebook like and Twitter follow buttons to improve social following. You can also redirect users to external web pages."
        },
        {
          featureName: "Formulas",
          name: "Advanced Operators",
          description: "You can use any mathematical(^, log etc) or logical (if then, average etc) operators."
        },
        {
          featureName: "Logic JUMP",
          name: "Full Access",
          description: "Apply logic jump to supported templates to improve personalization."
        },
        {
          featureName: "Analytics",
          name: "Advanced Analytics Reports",
          description: "Traffic Details, Lead Data, User responses & Funnel Visualization."
        },
        {
          featureName: "Support",
          name: "Priority",
          description: "You will have access to support docs, email support as well as live chat."
        }
      ];

        if(!isAppsumoUser && plan){
            switch(plan._id){
                case "freelancer":
                    return this.freelancer_features;
                case "essentials":
                    return this.essentials_features;
                case "business":
                    return this.business_features;
                default:
                    return null;
            }
        }else if(isAppsumoUser && plan){
            switch(plan._id){
                case "freelancer":
                    return this.freelancer_features;
                case "essentials":
                    return this.essentials_appsumo_features;
                case "business":
                    return this.business_appsumo_features;
                case "enterprise":
                    return this.enterprise_appsumo_features;
                default:
                    return null;
            }
        }else{
            return null;
        }

    }
}

export class PlanLimit{
    public id: String;
    public updatedAt :String;
    public createdAt :String;
    public name :String;
    public __v: number;
    public leads: number;
    public visits: number
    public templates:number;
    public calculators:number;
    public users:number;
    public active:boolean
    public description:String;
    constructor(planLimit: any){
        if(planLimit){
            this.id = planLimit._id;
            this.updatedAt = planLimit.updatedAt;
            this.createdAt = planLimit.createdAt;
            this.name = planLimit.name;
            this.__v = planLimit.__v;
            this.leads = planLimit.leads;
            this.visits = planLimit.visits;
            this.templates = planLimit.templates;
            this.calculators = planLimit.calculators;
            this.users = planLimit.users;
            this.active = planLimit.active;
            this.description = planLimit.description;
        }
    }
}

export class Features{
    public id: String;
    public updatedAt: Date;
    public createdAt: Date;
    public feature:Feature;
    public plan: String;
    public active: boolean;
    public type: String;
    public description : String;
    constructor(features:any){
        if(features){
            this.id = features._id;
            this.updatedAt = features.updatedAt;
            this.createdAt = features.createdAt;
            this.feature = new Feature(features.feature);
            this.plan = features.plan;
            this.active = features.active;
            this.type = features.type;
        }
    }
}

export class Feature{
    public id:String;
    public updatedAt:String;
    public createdAt:String;
    public name:String;
    public __v:String;
    public active:boolean;
    public description:String;
    constructor(feature:any){
        if(feature){
            this.id = feature.id;
            this.updatedAt = feature.updatedAt;
            this.createdAt = feature.createdAt;
            this.name = feature.name;
            this.__v = feature.__v;
            this.active = feature.active;
            this.description = feature.description;
        }
    }
}
export class Cycle{
    public id:String;
    public plan:String;
    public __v:number;
    public coupon_type:String;
    public coupon_active:boolean;
    public coupon_value:number;
    public coupon_name:String;
    public active:boolean;
    public name:String;
    public coupon_cycle:String;
    constructor(cycle:any){
        if(cycle){
            this.id = cycle.id;
            this.plan = cycle.plan;
            this.__v = cycle.__v;
            this.coupon_type = cycle.coupon_type;
            this.coupon_active = cycle.coupon_active;
            this.coupon_value = cycle.coupon_value;
            this.coupon_name = cycle.coupon_name;
            this.active = cycle.active;
            this.name = cycle.name;
            this.coupon_cycle = cycle.coupon_cycle;
        }
    }
}
