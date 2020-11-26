import React from 'react'

// 导入UI组件
import { Spin, Alert, Pagination } from 'antd'
// 导入 fetch-jsonp
import fetchJSONP from 'fetch-jsonp'

// 导入电影框
import MovieItem from './MovieItem.jsx'

class MovieList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      movies: [], // 电影列表
      nowPage: parseInt(props.match.params.page) || 1, // 当前展示第几页的数据
      pageSize: 12, // 每页显示多少条数据
      total: 0, // 当前电影分类下，总共有多少条数据
      isloading: true, // 数据是否正在加载， 如果为 true，表示正在加载数据
      movieType: props.match.params.type, // 保存一下 要获取的电影的类型
    }
  }
  componentWillMount() {
    this.loadMovieListByTypeAndPage()
  }

  // 组件将要接收新属性
  componentWillReceiveProps(nextProps) {
    console.log(nextProps.match)
    // 每当 地址栏，变化的时候，重置 state 中的 参数项，重置完毕之后，我们可以重新发起数据请求了
    this.setState(
      {
        isloading: true, // 又要重新加载电影数据了
        nowPage: parseInt(nextProps.match.params.page) || 1, // 要获取第几页的数据
        movieType: nextProps.match.params.type, // 电影类型
      },
      function () {
        this.loadMovieListByTypeAndPage()
      }
    )
  }

  render() {
    return <div>{this.renderList()}</div>
  }

  // 渲染电影列表的方法
  renderList = () => {
    if (this.state.isloading) {
      return (
        <Spin tip="Loading...">
          <Alert
            message="正在请求电影列表"
            description="精彩内容，马上呈现..."
            type="info"
          />
        </Spin>
      )
    } else {
      return (
        <section>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {this.state.movies.map((item) => {
              return <MovieItem {...item} key={item.id} history={this.props.history}></MovieItem>
            })}
          </div>
          <Pagination defaultCurrent={this.state.nowPage} pageSize={this.state.pageSize} total={this.state.total}  onChange={this.pageChanged}/>
        </section>
      )
    }
  }
  // 当页码改变的时候，加载新一页的数据
  pageChanged = (page) => {
    // 由于我们手动使用 BOM 对象，实现了跳转，这样不好，最好使用 路由的方法，进行编程式导航
    console.log(this.props);
    // window.location.href = '/#/movie/' + this.state.movieType + '/' + page
    // 使用 react-router-dom 实现编程式导航
    this.props.history.push('/movie/' + this.state.movieType + '/' + page)
  }
  // 根据电影类型和页码，获取电影数据
  loadMovieListByTypeAndPage = () => {
    // 开始获取数据的索引
    // const start = this.state.pageSize * (this.state.nowPage - 1)
    // const url = `https://api.douban.com/v2/movie/${this.state.movieType}?start=${start}&count=${this.state.pageSize}`
    const data = require('../test_data/' + this.state.movieType + '.json')
    setTimeout(() => {
      // 假设 1秒以后，数据获取回来了
      this.setState({
        isloading: false, // 当数据获取回来之后，把 isloading 加载中设置为 false
        movies: data.subjects, // 为电影列表重新赋值
        total: data.total, // 把总条数，保存到 state 上
      })
    }, 1000)
    // 注意： 默认的 window.fetch 收到跨域限制，无法直接是使用，这时候，我们使用 第三方包 fetch-jsonp 来发送 JSONP 请求，它的用法，和 浏览器内置的 fetch 完全兼容
    // fetchJSONP(url)
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log(data)
    //   })
  }
}

export default MovieList
