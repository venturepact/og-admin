import { NgModule, Component, AfterViewInit, OnInit, Input } from '@angular/core';
import {SharedModule} from '../modules/shared.module';
declare var jQuery: any;

@Component({
  selector: 'og-video-modal',
  templateUrl: './videoPopup.component.html',
  styleUrls: ['./css/video.style.css']
})
export class VideoModalComponent implements OnInit, AfterViewInit {
  @Input() templateType: string;
  overviewUrl: String = '';
  landingUrl: String = '';
  questionnaireUrl: String = '';
  resultsUrl: String = '';
  leadUrl: String = '';

  ngAfterViewInit() {
    jQuery('#overview').addClass('in active');

    jQuery('.responsive-menu-icon').click(function () {
      jQuery('.responsive-menu-list').animate({
        height: 'toggle'
      }, 300, function () {
      });
    });
    jQuery('.res-menu').click(function () {
      setTimeout(function () {
        jQuery(".responsive-menu-list").fadeOut()
          .css({ bottom: 0, position: 'absolute' })
          .animate({ bottom: 0 }, 300, function () { //callback });
          });
      }, 100);
    });

    let self = this;
    /** after modal close */
    jQuery('#video-modal').on('hidden.bs.modal', function (event) {
      self.modalClose();
    });
  }
  ngOnInit() {
    this.overviewUrl = "https://www.youtube.com/embed/NWep-z09ebE?hd=1&rel=0&autohide=1&showinfo=0";
    this.landingUrl = "https://www.youtube.com/embed/HjCMDC7ATNA?hd=1&rel=0&autohide=1&showinfo=0";
    this.questionnaireUrl = "https://www.youtube.com/embed/kJe8TVBdND0?hd=1&rel=0&autohide=1&showinfo=0";
    this.resultsUrl = "https://www.youtube.com/embed/09jwoM2K0XY?hd=1&rel=0&autohide=1&showinfo=0";
    this.leadUrl = "https://www.youtube.com/embed/IujD02VF7JA?hd=1&rel=0&autohide=1&showinfo=0";

  }
  modalClose() {
    localStorage.removeItem('show_popup');
    jQuery('#video-modal').modal('hide');
    jQuery('#video-modal iframe').attr("src", jQuery("#video-modal  iframe").attr("src"));
    jQuery("i.support_icon").addClass('bounceIn animated');
    jQuery('#video-modal').prop('class', 'modal fade') // revert to default
        .addClass('top-right');
    jQuery("i.support_icon").css('color','#fb5f66');
    setTimeout(function(){jQuery("i.support_icon").css('color','#8e989f');}, 1800);
  }

  overview() {
    jQuery('#overview').addClass('in active');
    //  jQuery('#overview-link').attr('src', '');
    // jQuery('#overview-link').attr('src', '');
    // jQuery('#overview-link').attr('src', this.overviewUrl);

    jQuery('#landing-page').removeClass('in active');
    jQuery('#landing-page-link').attr('src', '');
    jQuery('#landing-page-link').attr('src', this.landingUrl);

    jQuery('#questionnaire').removeClass('in active');
    jQuery('#questionnaire-link').attr('src', '');
    jQuery('#questionnaire-link').attr('src', this.questionnaireUrl);

    jQuery('#results').removeClass('in active');
    jQuery('#results-link').attr('src', '');
    jQuery('#results-link').attr('src', this.resultsUrl);

    jQuery('#lead-gen').removeClass('in active');
    jQuery('#lead-gen-link').attr('src', '');
    jQuery('#lead-gen-link').attr('src', this.leadUrl);

    jQuery('#summary').removeClass('in active');
    jQuery('#quiz').removeClass('in active');

  }

  landing() {
    jQuery('#landing-page').addClass('in active');

    jQuery('#overview').removeClass('in active');
    jQuery('#overview-link').attr('src', '');
    jQuery('#overview-link').attr('src', this.overviewUrl);

    jQuery('#questionnaire').removeClass('in active');
    jQuery('#questionnaire-link').attr('src', '');
    jQuery('#questionnaire-link').attr('src', this.questionnaireUrl);

    jQuery('#results').removeClass('in active');
    jQuery('#results-link').attr('src', '');
    jQuery('#results-link').attr('src', this.resultsUrl);

    jQuery('#lead-gen').removeClass('in active');
    jQuery('#lead-gen-link').attr('src', '');
    jQuery('#lead-gen-link').attr('src', this.leadUrl);

    jQuery('#summary').removeClass('in active');
    jQuery('#quiz').removeClass('in active');

  }

  questionnaire() {
    jQuery('#questionnaire').addClass('in active');

    jQuery('#overview').removeClass('in active');
    jQuery('#overview-link').attr('src', '');
    jQuery('#overview-link').attr('src', this.overviewUrl);

    jQuery('#landing-page').removeClass('in active');
    jQuery('#landing-page-link').attr('src', '');
    jQuery('#landing-page-link').attr('src', this.landingUrl);

    jQuery('#results').removeClass('in active');
    jQuery('#results-link').attr('src', '');
    jQuery('#results-link').attr('src', this.resultsUrl);

    jQuery('#lead-gen').removeClass('in active');
    jQuery('#lead-gen-link').attr('src', '');
    jQuery('#lead-gen-link').attr('src', this.leadUrl);

    jQuery('#summary').removeClass('in active');
    jQuery('#quiz').removeClass('in active');

  }

  results() {
    jQuery('#results').addClass('in active');

    jQuery('#overview').removeClass('in active');
    jQuery('#overview-link').attr('src', '');
    jQuery('#overview-link').attr('src', this.overviewUrl);

    jQuery('#landing-page').removeClass('in active');
    jQuery('#landing-page-link').attr('src', '');
    jQuery('#landing-page-link').attr('src', this.landingUrl);

    jQuery('#questionnaire').removeClass('in active');
    jQuery('#questionnaire-link').attr('src', '');
    jQuery('#questionnaire-link').attr('src', this.questionnaireUrl);

    jQuery('#lead-gen').removeClass('in active');
    jQuery('#lead-gen-link').attr('src', '');
    jQuery('#lead-gen-link').attr('src', this.leadUrl);

    jQuery('#summary').removeClass('in active');
    jQuery('#quiz').removeClass('in active');

  }

  leadGen() {
    jQuery('#lead-gen').addClass('in active');

    jQuery('#overview').removeClass('in active');
    jQuery('#overview-link').attr('src', '');
    jQuery('#overview-link').attr('src', this.overviewUrl);

    jQuery('#landing-page').removeClass('in active');
    jQuery('#landing-page-link').attr('src', '');
    jQuery('#landing-page-link').attr('src', this.landingUrl);

    jQuery('#questionnaire').removeClass('in active');
    jQuery('#questionnaire-link').attr('src', '');
    jQuery('#questionnaire-link').attr('src', this.questionnaireUrl);

    jQuery('#results').removeClass('in active');
    jQuery('#results-link').attr('src', '');
    jQuery('#results-link').attr('src', this.leadUrl);

    jQuery('#summary').removeClass('in active');
    //  jQuery('#summary-link').attr('src', '');
    //  jQuery('#summary-link').attr('src', this.summaryUrl);

    jQuery('#quiz').removeClass('in active');

  }

  summary() {
    jQuery('#summary').addClass('in active');

    jQuery('#overview').removeClass('in active');
    jQuery('#overview-link').attr('src', '');
    jQuery('#overview-link').attr('src', this.overviewUrl);

    jQuery('#landing-page').removeClass('in active');
    jQuery('#landing-page-link').attr('src', '');
    jQuery('#landing-page-link').attr('src', this.landingUrl);

    jQuery('#questionnaire').removeClass('in active');
    jQuery('#questionnaire-link').attr('src', '');
    jQuery('#questionnaire-link').attr('src', this.questionnaireUrl);

    jQuery('#results').removeClass('in active');
    jQuery('#results-link').attr('src', '');
    jQuery('#results-link').attr('src', this.resultsUrl);

    jQuery('#lead-gen').removeClass('in active');
    jQuery('#lead-gen-link').attr('src', '');
    jQuery('#lead-gen-link').attr('src', this.leadUrl);

    jQuery('#quiz').removeClass('in active');

  }

  quiz() {
    jQuery('#quiz').addClass('in active');

    jQuery('#summary').removeClass('in active');

    //  jQuery('#summary-link').attr('src', '');

    jQuery('#overview').removeClass('in active');
    jQuery('#overview-link').attr('src', '');
    jQuery('#overview-link').attr('src', this.overviewUrl);

    jQuery('#questionnaire').removeClass('in active');
    jQuery('#questionnaire-link').attr('src', '');
    jQuery('#questionnaire-link').attr('src', this.questionnaireUrl);

    jQuery('#results').removeClass('in active');
    jQuery('#results-link').attr('src', '');
    jQuery('#results-link').attr('src', this.resultsUrl);

    jQuery('#lead-gen').removeClass('in active');
    jQuery('#lead-gen-link').attr('src', '');
    jQuery('#lead-gen-link').attr('src', this.leadUrl);

    jQuery('#landing-page').removeClass('in active');
    jQuery('#landing-page-link').attr('src', '');
    jQuery('#landing-page-link').attr('src', this.landingUrl);

  }

}

