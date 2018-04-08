/**
 * Created by cbuonocore on 4/7/18.
 */
import React from 'react';
import createReactClass from 'create-react-class';

const Articles = createReactClass({
    render() {
        return (
            <div>
                <h1>Articles</h1>

                <hr/>

                <h4>Post: {new Date().toLocaleDateString()}</h4>

                <p className="article-content">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ac sodales velit. Etiam
                    eleifend augue id orci posuere, at ultricies massa vehicula. Integer id vehicula urna, sit amet
                    vestibulum nisi. Nulla gravida porttitor bibendum. Morbi efficitur, justo nec pellentesque
                    facilisis, augue eros dapibus nulla, in luctus turpis felis in ligula. Nullam et finibus nunc, quis
                    ullamcorper tellus. Suspendisse sollicitudin finibus justo, nec feugiat sapien auctor sed. Sed
                    lobortis mollis efficitur. Cras et ultrices felis, ut sodales magna. Vestibulum placerat dignissim
                    nisl, pellentesque ornare quam suscipit vitae. Nulla ultricies, erat gravida sagittis tempus, risus
                    ex finibus sapien, ut porttitor elit mi quis ligula. Cras ornare leo sed odio scelerisque posuere.
                    Sed faucibus tristique mauris sed porta. Mauris consectetur ac orci sed cursus. Nam eu elementum
                    lectus. Nam aliquam, libero vel tincidunt elementum, libero ipsum finibus magna, vel interdum risus
                    eros non mi.
                </p>

                <p className="article-content">

                    Etiam nunc massa, placerat sit amet turpis eget, elementum mattis augue. In eget enim nibh. Mauris
                    faucibus nec dui at ultricies. Integer id imperdiet lorem. Sed sit amet euismod diam. Donec lorem
                    nisi,egestas eget turpis sit amet, accumsan luctus tellus. Proin sit amet dui dignissim, tempor
                    leo ac,dignissim ligula. Maecenas sit amet ultricies tortor. Proin non fermentum est.
                    Pellentesque habitantmorbi tristique senectus et netus et malesuada fames ac turpis egestas. Morbi
                    dignissim pulvinarlectusa vehicula.
                </p>

            </div>
        );
    }
});

export default Articles;

