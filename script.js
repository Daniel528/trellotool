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

const text = {
  createCard: 'Create Card',
  addMemberToCard: 'Added Member to Card',
  updateCard: 'Updated Card',
  removeMemberFromCard: 'Removed Member from Card',
  commentCard: 'Commented on Card'
}

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
  console.log(data)
  const actions = data.actions
  memberList = data.members;
  const members = new Map();
  const dates = [];
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
    if(!dates.includes(newDate)) dates.push(newDate)
  })
  domChanges(data.name, dates, members, {before:[11, 3], after:[13, 5]})
}


const domChanges = (name, dates, members, dateRange) => {
  $('#team-name').html(name)
  $('#date-range').html(`Date Range: ${document.querySelector('#bottom-day').value}-${document.querySelector('#bottom-month').value} to 
  ${document.querySelector('#top-day').value}-${document.querySelector('#top-month').value}`)
  dates.map(x => {
    $('#dates').append(`<li>${x}</li>`) 
  })
  $('.users-title').html(`${members.size} Users Contributing`)
  members.forEach( (x, i) => {
    let name;
    let HTML =  '';
    Object.entries(x).map(x=> HTML = HTML.concat(
      `<div class="action">
        <h4>${text[x[0]] ? text[x[0]] : x[0]}</h4>
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
  const floor = [document.querySelector('#bottom-day').value, document.querySelector('#bottom-month').value];
  const ceiling = [document.querySelector('#top-day').value, document.querySelector('#top-month').value];


  if(date[1] < floor[1]) return false;
  if(date[1] == floor[1]){
    if(date[0] < floor[0]) return false;
  }

  if(date[1] > ceiling[1]) return false;
  if(date[1] == ceiling[1]){
    if(date[0] > ceiling[0]) return false;
  }
  return true;
}


// const getName = (id) => {
//   if(memberList == undefined) return;

//   memberList.map( x => {
//     if(x.id == id) {
//       return x.fullName
//     }
//   })
// }
