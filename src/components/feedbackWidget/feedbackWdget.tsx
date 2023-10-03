import { Component, h, getAssetPath, State, Prop, Element } from '@stencil/core';

@Component({
  tag: 'ifx-feedback-widget',
  styleUrl: 'feedbackWidget.css',
  shadow: true,
  assetsDirs: ['assets']
})

export class FeedbackWidget {
  @Element() el;
  @Prop() appName = "Product"
  @State() quetionsArray = [];
  @State() feedBackData = [];
  @State() qIndex = 0;
  @State() phaseOne: boolean = true;
  @State() phaseTwo: boolean = false;
  @State() phaseEnd: boolean = false;
  @State() textAreaIsActive: boolean = false;
  @State() textAreaData: string = ""
  @State() isCompact: boolean = true;

  private questionOne = `How satisfied are you with the ${this.appName}'s value for money?`
  private questionTwo = `How satisfied are you with ${this.appName}'s ease of use?`
  private questionThree = `How satisfied are you with ${this.appName}'s reliability?`
  private questionFour = `How satisfied are you with the look of ${this.appName}'s interface?`
  private questionFive = `Is there anything you'd especially like us to improve?`

  componentWillLoad() { 
    this.quetionsArray.push(this.questionOne, this.questionTwo, this.questionThree, this.questionFour)
    this.checkCookie()
  }

  handleProgressBar() { 
    const progressBar = this.el.shadowRoot.querySelector('.progress__bar-fill');
    const totalWidth = 100; 
    const numberOfClicks = this.quetionsArray.length + 1; 
    const widthPerClick = totalWidth / numberOfClicks; 
    const currentWidthString = getComputedStyle(progressBar).getPropertyValue('--progress-width');
    const currentWidthNumeric = parseFloat(currentWidthString) || 0;
    const newWidthNumeric = currentWidthNumeric + widthPerClick;
    const updatedWidth = Math.min(newWidthNumeric, totalWidth);
  
    progressBar.style.setProperty('--progress-width', `${updatedWidth}%`);
  }

  handleQuestionChange(e) { 
    if(e.target.nodeName.toLowerCase() === 'img') { 
      if(this.qIndex+1 <= this.quetionsArray.length-1) { 
        this.qIndex++;
      } else if(this.qIndex > 2) {
        this.phaseTwo = true;
        this.phaseOne = false;
      }
      this.handleProgressBar()
      this.feedBackData.push({question: this.quetionsArray[this.qIndex], rate: e.target.alt})
    }
  }

  userInputText(e) { 
    if(e.target.value.toLowerCase() !== "") { 
      this.textAreaIsActive = true;
      this.textAreaData = e.target.value;
    } else this.textAreaIsActive = false;
  }

  handleSubmission() { 
    this.phaseTwo = false;
    this.phaseEnd = true;
    this.feedBackData.push({freeText: this.textAreaData})
    this.feedBackData.push({domain: window.location.hostname, appName: this.appName})

    // const url = 'https://example.com/api';
    // const dataArray = this.feedBackData;
 
    // const requestOptions = {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json', 
    //   },
    //   body: JSON.stringify(dataArray), 
    // };
    // fetch(url, requestOptions)
    // .then((response) => {
    //   if (!response.ok) {
    //     throw new Error('Network response was not ok');
    //   }
    // })
    // .catch((error) => {
    //   console.error('Error:', error);
    // });
    this.setCookie();
  }

  handleClosure() {
    this.isCompact = true;
  }
  
  handleSameUser() { 
    this.el.style.display = 'none';
  }

  handleCompactContainer() { 
    this.isCompact = false
  }

  setCookie() {
    let user = "";
    for (let i = 0; i < 19; ++i) user += Math.floor(Math.random() * 10);
    localStorage.setItem('username', user);
  }

  checkCookie() {
    let user = localStorage.getItem('username');
    if (user !== null) {
      this.handleSameUser();
    }
  }


  render() {
    const angryEmoji = getAssetPath(`../assets/emojiAngry.png`);
    const emojiHeartEyes = getAssetPath(`../assets/emojiHeartEyes.png`);
    const emojiNeutral = getAssetPath(`../assets/emojiNeutral.png`);
    const emojiSad = getAssetPath(`../assets/emojiSad.png`);
    const emojiSmile = getAssetPath(`../assets/emojiSmile.png`);

 
    return (
      <div class={`main__container ${!this.isCompact ? 'open' : ""}`}>
          <div class='compact__container' onClick={() => this.handleCompactContainer()}>
            <div class='compact__wrapper'>
              <p>Feedback</p>
              <div class='compact-icon'>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16"><path stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" d="M5.5 7.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.5 6.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM5.5 9.5c-2.723 0-5 2.277-5 5h10c0-2.723-2.277-5-5-5ZM10.841 9a2.986 2.986 0 0 1 1.659-.5c2.342 0 3 2.087 3 4h-3"/></svg>
              </div>
            </div>
          </div>
          <div class='container'>
        <div class={`top__wrapper ${this.phaseEnd ? 'hide' : ""}`}>
          {/* <div class="heading-label">Your feedback matters!</div> */}
          <div class="progress-bar">
            <div class="progress__bar-fill"></div>
          </div>
          <div class='close-button' onClick={() => this.handleClosure()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16"><path stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" d="m13.5 2.5-11 11M2.5 2.5l11 11"/></svg>
          </div>
        </div>
        <div class='bottom__wrapper'>
          <div class={`phase__one ${!this.phaseOne ? 'hide' : ""}`}>
            <div class='question-label'>
              {this.quetionsArray[this.qIndex]}
            </div>
            <div class='rating-emojis' onClick={(e) => this.handleQuestionChange(e)}>
                <img src={angryEmoji} alt="angry" />
                <img src={emojiSad} alt="sad" />
                <img src={emojiNeutral} alt="neutral" />
                <img src={emojiSmile} alt="smile" />
                <img src={emojiHeartEyes} alt="happy" />
            </div>
            <div class='rating-label'>
              <div>Poor</div>
              <div>Excellent</div>
            </div>
          </div>
          <div class={`phase__two ${this.phaseTwo ? 'show' : ""}`}>
            <div class='question-label'>
              {this.questionFive}
            </div>
            <div class='text__input'>
              <p class='hint__text'>Answer required</p>
              <textarea onInput={(e) => this.userInputText(e)}></textarea>
            </div>
            <div class={`submit__button ${this.textAreaIsActive ? "active" : ""}`}>
              <button disabled={!this.textAreaIsActive} onClick={() => this.handleSubmission()}>Submit</button>
            </div>
          </div>
          <div class={`phase__end ${this.phaseEnd ? 'show' : ""}`}>
            Thank you for taking part in our survey
          </div>
        </div>
          </div> 
      </div>
    );
  }

  static insertWidget() {
    const widget = document.createElement('ifx-feedback-widget');
    document.body.appendChild(widget);
  }
  
}