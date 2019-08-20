// fetch('./activeboard.json')
// .then( response => {
//   if(response.status != 200){
//     console.log(`Issue with laoding the file. Status Code: ${response.status}`)
//     return;
//   }
//   response.json().then( data => {
//     main(data)
//   })
// })


// browser-sync start --server --files="./"

const text = {
  createCard: 'Create Card',
  addMemberToCard: 'Added Member to Card',
  updateCard: 'Updated Card',
  deleteCard: 'Delete Card',
  removeMemberFromCard: 'Removed Member from Card',
  commentCard: 'Commented on Card',
  addAttachmentToCard: 'Add Attachment To Card',
  createList: 'Create List',
  updateList: 'Update List',
  enablePlugin: 'Enable Plugin',
  disablePlugin: 'Disable Plugin',
  updateBoard: 'Update Board',
  unconfirmedBoardInvitation: 'Unconfirmed Board Invitation',
  addMemberToBoard: 'Add Member To Board',
  makeAdminOfBoard: 'Make Admin of Board',
  createBoard: 'Created Board'
}

const bottomDay = document.querySelector('#bottom-day');
const bottomMonth = document.querySelector('#bottom-month');
const topDay = document.querySelector('#top-day');
const topMonth = document.querySelector('#top-month');

let inputOpen = false;

document.querySelector('.new-data').onclick = (e) => {
  $('.input-overlay').toggle();

}

const unMount = () => {
  $('#dates').empty();
  $('#members').empty();
  $('.input-overlay').toggle();

}

const submit = () => {
  unMount()
  main(JSON.parse(document.querySelector('#json-input').value))

}

let memberList = undefined;

const main = (data) => {
  const actions = data.actions
  memberList = data.members;
  const members = new Map();
  const dates = new Map();
  actions.map(x => {
    const b = new Date(x.date)
    const date = b.getDate();
    const month = b.getMonth() + 1;

    if ( !betweenDates([date, month]) ) return;
    
    if(!members.get(x.idMemberCreator)) {
      var object = {};
      object[x.type] = 1;
      members.set(x.idMemberCreator, object);
    } else {
      const obj = members.get(x.idMemberCreator);
      if(obj.hasOwnProperty(x.type)){
        obj[x.type] = obj[x.type] + 1;
      } else {
        obj[x.type] = 1;
      }
      members.set(x.idMemberCreator,obj)
    }
    const newDate = `${b.getDate()}-${b.getMonth()+1}-${b.getFullYear()}`;
    if(dates.has(newDate)){
      dates.set(newDate, dates.get(newDate) + 1)
    } else{
      dates.set(newDate, 1)
    } 
  })
  domChanges(data.name, dates, members)
}


const domChanges = (name, dates, members) => {
  $('#team-name').html(name)
  $('#date-range').html(`Date Range: ${bottomDay.value}-${bottomMonth.value} to 
  ${topDay.value}-${topMonth.value}`)
  
  for (var [key, value] of dates){
    $('#dates').append(`<li>${key} [${value}]</li>`) 
  }

  $('.users-title').html(`${members.size} Users Contributing`)
  members.forEach( (x, i) => {
    let name;
    let HTML =  '';
    Object.entries(x).map(x=> HTML = HTML.concat(
      `<div class="action">
        <span>${text[x[0]] ? text[x[0]] : x[0]}</span>
        <p>${x[1]}</p>
      </div>`
      
      ))
    memberList.map( obj => { if(obj.id == i) name = obj.fullName }) 
    $('#members').append(
      `<div class="member">
        <h2>${name}</h2>
        <div class="actions">
        ${HTML}
        </div>
      </div>`
    )

  })
}

const betweenDates = (date) => {
  if(date[1] < bottomMonth.value) return false;
  if(date[1] == bottomMonth.value){
    if(date[0] < bottomDay.value) return false;
  }

  if(date[1] > topMonth.value) return false;
  if(date[1] == topMonth.value){
    if(date[0] > topDay.value) return false;
  }
  return true;
}
