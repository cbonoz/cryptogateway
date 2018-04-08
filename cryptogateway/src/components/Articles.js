/**
 * Created by cbuonocore on 4/7/18.
 */
import React from 'react';
import createReactClass from 'create-react-class';

const Articles = createReactClass({

    componentWillMount() {
        this.setState({
            text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ac sodales velit. Etiam
        eleifend augue id orci posuere, at ultricies massa vehicula. Integer id vehicula urna, sit amet
        vestibulum nisi. Nulla gravida porttitor bibendum. Morbi efficitur, justo nec pellentesque
        facilisis, augue eros dapibus nulla, in luctus turpis felis in ligula. Nullam et finibus nunc,
            quis
        ullamcorper tellus. Suspendisse sollicitudin finibus justo, nec feugiat sapien auctor sed. Sed
        lobortis mollis efficitur. Cras et ultrices felis, ut sodales magna. Vestibulum placerat
        dignissim
        nisl, pellentesque ornare quam suscipit vitae. Nulla ultricies, erat gravida sagittis tempus,
            risus
        ex finibus sapien, ut porttitor elit mi quis ligula. Cras ornare leo sed odio scelerisque
        posuere.
            Sed faucibus tristique mauris sed porta. Mauris consectetur ac orci sed cursus. Nam eu elementum
        lectus. Nam aliquam, libero vel tincidunt elementum, libero ipsum finibus magna, vel interdum
        risus
        eros non mi.`
        });
    },


    render() {
        const self = this;
        const text = self.state.text;
        return (
            <div className="article-page">
                <div className="article-section centered">
                    <h1>Articles</h1>

                    <hr/>
                    {["New Features", "Beta Testing", "Announcement"].map((title) => {

                        return <div className="article-post">
                            <h4>Post: {title}</h4>
                            <p><i>{new Date().toLocaleDateString()}</i></p>
                            <p className="article-content">{text}</p>
                        </div>
                    })}

                </div>
            </div>
        );
    }
});

export default Articles;

