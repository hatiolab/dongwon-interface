import 'url-polyfill'
import 'url-search-params-polyfill'
import { SceneIntegrator } from '@things-scene/things-board-integration'

export function init({ baseURL = 'https://deadpool.hatiolab.com/rest', queryString, authorizationKey, license = '' }) {
  var fit = 'both' // 'both', 'ratio', 'center', 'none'

  var searchParams

  if (!queryString) {
    return alert('Parameter가 존재하지 않습니다.')
  }

  searchParams = new URLSearchParams(queryString)

  var sceneName = searchParams.get('scene')
  var keepingTime = new URL(window.location.href).searchParams.get('interval') || 30
  var list = sceneName.split(/\s*,\s*/)
  var viewers = []
  var token = searchParams.get('token')

  authorizationKey = token || authorizationKey;

  if (!sceneName) {
    return alert('Scene name이 필요합니다.')
  }

  var integrator = SceneIntegrator.instance({
    authorizationKey,
    withCredentials: true,
    baseURL,
    fit,
    license
  })
  var index = 0
  var num = 0
  var boards = []

  function showBoard(index) {
    var targetId = 'scene-viewer' + index
    let div = document.createElement('div')
    div.setAttribute('id', targetId)
    div.setAttribute('class', 'scene-viewer')
    div.hidden = true
    document.body.appendChild(div)

    integrator.integrate({
      target: targetId,
      sceneName: 'SCENE-' + list[index],
      callback: callback1
    })
  }
  showBoard(index)

  // 인티그레이터 화면(div) 리스트 생성
  function playIntegrator(length, num, viewers) {
    // 자신의 순서인 viewer만 보이고 나머지는 전부 히든
    viewers.forEach((v, index) => {
      v.hidden = num != index
    })

    num = num + 1 < length ? num + 1 : 0

    boards.forEach(b => integrator.fit(fit, b))

    setTimeout(function () {
      playIntegrator(length, num, viewers)
    }, keepingTime * 1000)
  }
  // 콜백은 나중에 필요하면 사용
  function callback1(board, e) {
    if (e) {
      console.error(e)
      return
    }

    boards.push(board)

    window.addEventListener('resize', function () {
      integrator.fit(fit, board)
    })

    if (index == list.length - 1) {
      viewers = Array.from(document.querySelectorAll('.scene-viewer'))
      playIntegrator(list.length, num, viewers)
      document.body.removeChild(document.getElementById('splash'))
    }
    index++
    if (index < list.length) {
      showBoard(index)
    }
  }
}
