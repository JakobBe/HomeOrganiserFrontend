export default getDayMarkerDots = (marks, event, users) => {
  let dots = [];
  const dotMarkers = users.map(user => {
    return { key: user.name, color: user.color };
  });
  users.map(user => {
    if (event.userId === user.id) {
      if (dots.length === 0) {
        dots = dotMarkers.filter(marker => marker.key === user.name);
      }
      if (marks[event.date] && marks[event.date]['dots']) {
        marks[event.date]['dots'].map(dot => {
          if (dot['key'] !== user.name && marks[event.date]['dots'].length !== users.length) {
            let newDot = dotMarkers.filter(marker => marker.key === user.name)[0];
            if (!dots.includes(newDot)) {
              dots.push(newDot)
            }
            if (!dots.includes(dot)) {
              dots.push(dot);
            }
          };
          if (marks[event.date]['dots'].length >= users.length) {
            dots = marks[event.date]['dots']
          };
        })
      }
    };
  })
  return dots;
}